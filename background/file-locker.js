class FileLocker {
    errorCallback(error) {
      console.log("Error in Locker.", error);
    }
  
    constructor() {
      return new Promise((resolve, reject) => {
        navigator.webkitPersistentStorage.requestQuota(5 * 1024 * 1024, grantedBytes =>
          window.webkitRequestFileSystem(PERSISTENT, grantedBytes,
            fs => {
                this.fs = fs;
                resolve(this);
            }
          ),
          this.errorCallback
        );
      })
    }
  
    createDirectory(path, callback) {
      this.fs.root.getDirectory(
        path,
        { create: true },
        directory => callback(directory),
        this.errorCallback
      );
    }
  
    removeDirectory(path, callback) {
      this.fs.root.getDirectory(
        path,
        {},
        dirEntry => dirEntry.removeRecursively(callback, callback),
        callback
      );
    }
  
    listDirectory(path, callback, createIfNotFound) {
      function listDir(directory, callback) {
        var dir_reader = directory.createReader();
        var entries = [];
  
        let readEntries = _ => {
          let readResults = results => {
            if (!results.length) callback(entries);
            else {
              entries = entries.concat(
                Array.prototype.slice.call(results || [], 0)
              );
              readEntries();
            }
          };
          dir_reader.readEntries(readResults, function() {});
        };
        readEntries();
      }
  
      this.fs.root.getDirectory(
        path,
        {},
        directory => listDir(directory, callback),
        createIfNotFound ? this.createDirectory(path, callback) : this.errorCallback
      );
    }
  
    loadFile(path, callback, notFoundCallback) {
      //getFile is inconstent immediately after reloads, so must iterate through always
      //consistent listDirectory
      this.listDirectory('/', entries => {
        var fileEntry = Array.prototype.slice.call(entries).find(entry => entry.fullPath === path);
        if(fileEntry) {
          fileEntry.file(file => {
            var reader = new FileReader();
            reader.onloadend = function(e) {
              var data = this.result;
              callback(data);
            };
            reader.readAsText(file);
          });
        } else {
          notFoundCallback();
        }
      });
    }
  
    saveFile(path, data, callback) {
      let createFile = (path, data, callback) => {
        this.fs.root.getFile(path, { create: true }, fileEntry => {
          fileEntry.createWriter(fw => {
            var blob = new Blob([data], { type: "text/plain" });
            fw.write(blob);
            if (callback) callback(fileEntry);
          });
        });
      };
  
      createFile(path, data, callback);
    }
  
    removeFile(path, callback) {
      this.fs.root.getFile(path, { create: false }, fileEntry =>
        fileEntry.remove(callback, callback)
      );
    }
  }