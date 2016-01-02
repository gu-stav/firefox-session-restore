#!/usr/bin/env node

var _ = require('lodash');
var colors = require('colors');
var fs = require('fs');
var program = require('commander');
var url = require('url');
var titleCache = [];
var urlCache = [];

program.parse(process.argv);

fs.readFile(program.args[0], function(e, fc) {
  if(e) {
    throw e;
  }

  var contentAsJSON = JSON.parse(fc);

  _.each(contentAsJSON, function(item, index) {
    if(_.isArray(item)) {
      _.each(item, function(subitem, subindex) {
        _.each(subitem, function(tab, tabindex) {
          if(tabindex === 'tabs') {
            _.each(tab, function(tabcontent, subtabindex) {
              if(tabcontent.pinned && tabcontent.pinned === true) {
                _.each(tabcontent.entries, function(entry, entryindex) {

                  // only use items with unique titles
                  if(titleCache.indexOf(entry.title) === -1) {
                    var parsedUrl = url.parse(entry.url);

                    // only one item per host
                    if(urlCache.indexOf(parsedUrl.host) === -1 ) {
                      console.log('title: '.green, entry.title);
                      console.log('pinned: '.green, entry.url);
                      console.log('---------------------------'.yellow);

                      titleCache.push(entry.title);
                      urlCache.push(parsedUrl.host);
                    }
                  }
                })
              }
            })
          }
        })
      });
    }
  });

  console.log('Restored: '.red, titleCache.length, 'Items'.red );
});

