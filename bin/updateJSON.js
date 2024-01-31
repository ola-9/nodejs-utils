#!/usr/bin/env node

import { program } from 'commander';
import updateJSON from '../index.js';

program
  .version('0.0.1')
  .arguments('<path>')
  .description('update configuration file')
  .action((path) => {
    updateJSON(path);
  })
  .parse(process.argv);
