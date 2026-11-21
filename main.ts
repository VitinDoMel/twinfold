/**
 * Twinfold submission bundler.
 * Packages the standalone game assets and verified visual captures
 * into the target distribution folder, synthesizing the evaluation dossier.
 */

import * as filesystem from 'node:fs';
import * as filepath from 'node:path';
import { fileURLToPath as resolveFilePath } from 'node:url';
import { buildDossier as generateDossierSummary } from './vendor/makefun-game.ts';

interface PackagingOptions {
  sourceDirectory: string;
  targetDirectory: string;
}

const DOSSIER_CONSTRAINTS = {
  text_max_bytes: 163840,
  screenshots: {
    max: 4,
    max_bytes: 262144,
  },
  game_max_files: 993,
  game_max_bytes: 50331648,
  game_path_max_bytes: 1000,
} as const;

function synchronizeDirectory(origin: string, destination: string): void {
  if (!filesystem.existsSync(origin)) {
    return;
  }
  filesystem.mkdirSync(destination, { recursive: true });
  filesystem.cpSync(origin, destination, { recursive: true });
}

function produceSubmissionBundle(options: PackagingOptions): void {
  const { sourceDirectory, targetDirectory } = options;

  // Ensure root output destination exists
  filesystem.mkdirSync(targetDirectory, { recursive: true });

  // Transfer client game distribution
  const clientSource = filepath.join(sourceDirectory, 'game');
  const clientDestination = filepath.join(targetDirectory, 'game');
  synchronizeDirectory(clientSource, clientDestination);

  // Transfer captured gameplay screenshots
  const capturesSource = filepath.join(sourceDirectory, 'screenshots');
  const capturesDestination = filepath.join(targetDirectory, 'screenshots');
  synchronizeDirectory(capturesSource, capturesDestination);

  // Compile evaluative dossier document
  const dossierPayload = generateDossierSummary(targetDirectory, DOSSIER_CONSTRAINTS);
  const dossierLocation = filepath.join(targetDirectory, 'dossier.json');
  filesystem.writeFileSync(dossierLocation, dossierPayload);
}

function executePackaging(): void {
  const scriptFolder = filepath.dirname(resolveFilePath(import.meta.url));
  const outputFolder = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

  produceSubmissionBundle({
    sourceDirectory: scriptFolder,
    targetDirectory: outputFolder,
  });
}

executePackaging();
