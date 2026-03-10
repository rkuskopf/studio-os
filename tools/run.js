#!/usr/bin/env node

/**
 * KSPF Lead Generation — Master Runner
 * 
 * One command to run the full automated lead pipeline.
 * 
 * Usage:
 *   node run.js maps --query "fashion boutique melbourne"
 *   node run.js maps --preset
 *   node run.js instagram --hashtags "melbournebrand,indiebeauty"
 *   node run.js full  (runs both pipelines)
 */

import { spawn } from 'child_process';
import { existsSync } from 'fs';
import chalk from 'chalk';

const args = process.argv.slice(2);
const command = args[0];

function runCommand(cwd, cmd, cmdArgs) {
  return new Promise((resolve, reject) => {
    console.log(chalk.gray(`\n$ cd ${cwd} && node ${cmd} ${cmdArgs.join(' ')}\n`));
    const proc = spawn('node', [cmd, ...cmdArgs], {
      cwd,
      stdio: 'inherit'
    });
    proc.on('close', code => code === 0 ? resolve() : reject(new Error(`Exit ${code}`)));
    proc.on('error', reject);
  });
}

async function main() {
  console.log(chalk.bold.cyan(`
╔═══════════════════════════════════════════════════════════╗
║          KSPF Automated Lead Generation                   ║
╚═══════════════════════════════════════════════════════════╝
`));

  if (!command || command === 'help') {
    console.log(chalk.bold('Commands:\n'));
    
    console.log(chalk.cyan('  maps') + ' — Scrape Google Maps + audit websites');
    console.log(chalk.gray('    node run.js maps --query "fashion boutique melbourne"'));
    console.log(chalk.gray('    node run.js maps --preset  (use all KSPF target queries)'));
    console.log(chalk.gray('    node run.js maps --preset --limit 5  (quick test)\n'));
    
    console.log(chalk.cyan('  instagram') + ' — Scrape Instagram hashtags + extract profiles + audit');
    console.log(chalk.gray('    node run.js instagram --hashtags "melbournebrand,indiebeauty"'));
    console.log(chalk.gray('    node run.js instagram --preset\n'));
    
    console.log(chalk.cyan('  full') + ' — Run both pipelines');
    console.log(chalk.gray('    node run.js full\n'));
    
    console.log(chalk.bold('Output:'));
    console.log('  Ranked CSV files with lead scores based on website UX/accessibility issues.');
    console.log('  Higher score = worse website = better lead for KSPF.\n');
    return;
  }

  const passArgs = args.slice(1);
  
  if (command === 'maps') {
    await runCommand('./website-auditor', 'pipeline.js', passArgs);
  } 
  else if (command === 'instagram') {
    await runCommand('./brand-monitor', 'pipeline.js', passArgs);
  }
  else if (command === 'full') {
    console.log(chalk.bold('\n🗺️  Running Google Maps pipeline...\n'));
    try {
      await runCommand('./website-auditor', 'pipeline.js', ['--preset', '--limit', '10']);
    } catch (e) {
      console.log(chalk.yellow('Maps pipeline had issues, continuing...\n'));
    }
    
    console.log(chalk.bold('\n📱 Running Instagram pipeline...\n'));
    try {
      await runCommand('./brand-monitor', 'pipeline.js', ['--preset']);
    } catch (e) {
      console.log(chalk.yellow('Instagram pipeline had issues.\n'));
    }
    
    console.log(chalk.bold.green('\n✅ All pipelines complete!\n'));
    console.log('Check these files for leads:');
    console.log(chalk.gray('  website-auditor/final-leads.csv'));
    console.log(chalk.gray('  brand-monitor/final-instagram-leads.csv\n'));
  }
  else {
    console.log(chalk.red(`Unknown command: ${command}`));
    console.log('Run "node run.js help" for usage.\n');
  }
}

main().catch(e => {
  console.error(chalk.red('\nPipeline error:'), e.message);
  process.exit(1);
});
