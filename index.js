var fs          = require('fs'),
    path        = require('path'),
    through     = require('through2'),
    PluginError = require('gulp-util').PluginError,
    File        = require('gulp-util').File;

var getRequiredFiles = function (file, cb) {


    var lineReader = require('readline').createInterface({
            'input' : fs.createReadStream(file)
        }),
        files = [],
        filename = '';


    lineReader.on('line', (line) => {
 
        if (line.indexOf("//=") === -1)
            return; 
       
        if (line.indexOf('require') === -1)
            return;


        var tmp = path.dirname(file) + '/' + 
                    line.substring(
                        line.indexOf('require') + 'require'.length).trim();

        var absPath = path.normalize(tmp);

        var filename = path.basename(absPath);

        files.push(filename);

    });

    lineReader.on('close', () => {
    
        cb(files);

    });

};

var prepTopoSort = function (files) {

    var graph = [];

    files.forEach(function (f, i) {
  
        f.require.forEach(function (r, j) {

            graph.push([r, path.basename(f.absolute)]); 
        
        });

    
    });

    return graph;

};

module.exports = function () {

    var files       = [],
        allFiles    = { };

    var bufferContent = function (file, enc, cb) {

        if (file.isNull() || file.isStream()) {
            cb();
            return;
        }

        if (file.isStream()) {

            this.emit('error', new PluginError('gulp-require', 'Streaming not supported.'));
            cb();
            return;

        }

        allFiles[path.basename(file.path)] = file;

        var item = {
            'file'      : file,
            'absolute'  : file.path,
            'require'   : []
        };

        getRequiredFiles(file.path, (rFiles) => {
        
            item.require = rFiles;
            files.push(item);
            cb();
        
        });
   
    };

    var endStream = function (cb) {
    
        var loop    = require('asyncloop'),
            i       = 0;

        var done = function () {
   
            var graph       = prepTopoSort(files),
                toposort    = require('toposort'),
                sorted;

            try {
                sorted      = toposort(graph);
            } catch (e) {
                this.emit('error', new PluginError('gulp-require', 'Cyclic dependency.'));
                cb();
                return;
            }
  
            files.forEach(function (f, i) {

                var bs = path.basename(f.absolute);

                if (sorted.indexOf(bs) === -1) {
                
                    sorted.push(bs);

                }
            
            });

            sorted.forEach(function (f, i) {

                if (!allFiles[f]) {
                    this.emit('error', new PluginError('gulp-require', f + ' required but not found.'));
                    cb();
                    return;
                }

                this.push(allFiles[f]);
            
            }.bind(this));

            cb();


        }.bind(this);

        loop(function (next) {
        
            if (i === files.length) {

                done();
                return;

            }

            getRequiredFiles(files[i].absolute, (rFiles) => {
            
                files[i].require = rFiles;

                i += 1;

                next();

            });
        
        });
    
    };

    return through.obj(bufferContent, endStream);

};

