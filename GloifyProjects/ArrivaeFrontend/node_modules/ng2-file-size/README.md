# ng2-file-size [![npm version](https://badge.fury.io/js/ng2-file-size.svg)](http://badge.fury.io/js/ng2-file-size) [![npm downloads](https://img.shields.io/npm/dm/ng2-file-size.svg)](https://npmjs.org/ng2-file-size)

[![Build Status](https://travis-ci.org/pkantsedalov/ng2-file-size.svg?branch=master)](https://travis-ci.org/pkantsedalov/ng2-file-size)

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

  - [Description](#description)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Demo](#demo)
  - [Acknowledgments](#acknowledgments)
  - [Development](#development)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Description

Angular 2 validation directive for checking `<input type="file" />` value to be of the valid size.

Works both with one & multiple files mode.

## Installation
`npm install ng2-file-size --save`

`npm i ng2-file-size -S` (shortcut)

## Usage

**Attention**: in [beta version]() use `[ng2FileSizeErrorMsg]` param instead of `[fileSizeErrorMsg]` one. 

1. import the module to your one:

```typescript

    import { Ng2FileSizeModule } from 'ng2-file-size';

    @NgModule({
      ...
      imports: [
        ...
        Ng2FileSizeModule
      ]
    })
    ...

```

2. then use the directive:

```html
    <!-- 
        1. Make it's size restricted by min value (in bytes).
        2. The error message is a default one: 'File size is invalid' 
    -->
    <input type="file" [ng2FileSize]="{ min: 1024 }" />
    
    <!-- 
        1. Make it's size restricted by max value (in bytes).
        2. The error message is a default one: 'File size is invalid'
    -->
    <input type="file" [ng2FileSize]="{ max: 1024 }" />
    
    <!-- 
        1. Make it's size restricted by min & max values (in bytes).
        2. The error message is customized to 'File size must be less that 1mb and more that 1kb!' 
    -->
    <input 
      type="file" 
      [ng2FileSize]="{ min: 1024, max: 1024 * 1024 }"
      [fileSizeErrorMsg]="'File size must be less that 1mb and more that 1kb!'"
    />

    <!--
        1. Make it's size restricted by dynamic values (in bytes).
        2. The error message is customized dynamically
    -->
    <input
      type="file"
      [ng2FileSize]="fileSizeRestrictions"
      [fileSizeErrorMsg]="customErrorMessage"
    />
```

## Demo
See it [here](https://pkantsedalov.github.io/ng2-file-size).

## Acknowledgments
I express my gratitude to the [valor-software](https://github.com/valor-software) team.
This project structure is based on their [ng2-file-upload](https://github.com/valor-software/ng2-file-upload) solution, their [tslint configuration](https://github.com/valor-software/tslint-config-valorsoft) and [npm submodules manager](https://www.npmjs.com/package/ngm-cli). 

## Development
1. Clone/fork it
 
2. In `./src` directory you can find the directive sources & unit tests, in the `./demo` one - the files for Github Pages demo.

3. Use next npm scripts for development (they use [angular-cli](https://github.com/angular/angular-cli) and [ngm-cli](https://www.npmjs.com/package/ngm-cli)):
 
    3.1. `npm start` serves with `ng serve` command;
    
    3.2. `npm build` - created `./dist` directory in the end;
    
    3.3 `npm test` - runs unit tests with `ng test` using Karma and Angular 2 testing tools.

    3.4 `npm run e2e` - runs e2e tests using Protractor and Selenium  Webdriver.