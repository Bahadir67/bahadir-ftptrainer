const fs = require('fs');
const path = require('path');

// Read the workouts.ts file
const workoutsPath = path.join(__dirname, '..', 'src', 'data', 'workouts.ts');
const content = fs.readFileSync(workoutsPath, 'utf-8');

// Extract constants
const ftpCurrentMatch = content.match(/export const FTP_CURRENT = (\d+)/);
const ftpTargetMatch = content.match(/export const FTP_TARGET = (\d+)/);
const planStartMatch = content.match(/export const PLAN_START = '([^']+)'/);
const planEndMatch = content.match(/export const PLAN_END = '([^']+)'/);

// Extract week summaries
const weekSummaries = [];
const weekRegex = /\{ week: (\d+), phase: '(\w+)', startDate: '([^']+)', endDate: '([^']+)', targetTSS: (\d+), targetHours: ([\d.]+), strengthSessions: (\d+), isRecoveryWeek: (true|false), focus: '([^']+)' \}/g;
let match;
while ((match = weekRegex.exec(content)) !== null) {
  weekSummaries.push({
    week: parseInt(match[1]),
    phase: match[2],
    startDate: match[3],
    endDate: match[4],
    targetTSS: parseInt(match[5]),
    targetHours: parseFloat(match[6]),
    strengthSessions: parseInt(match[7]),
    isRecoveryWeek: match[8] === 'true',
    focus: match[9]
  });
}

// Extract workouts - simpler approach, extract key fields
const workouts = [];
const workoutBlocks = content.split(/\n  \{[\s]*\n    date:/g).slice(1);

for (const block of workoutBlocks) {
  const dateMatch = block.match(/^[\s]*'([^']+)'/);
  const dayMatch = block.match(/dayOfWeek: '([^']+)'/);
  const typeMatch = block.match(/type: '([^']+)'/);
  const titleMatch = block.match(/title: '([^']+)'/);
  const durationMatch = block.match(/duration: (\d+)/);
  const tssMatch = block.match(/tss: (\d+)/);
  const descMatch = block.match(/description: '([^']+)'/);
  const weekMatch = block.match(/week: (\d+)/);
  const phaseMatch = block.match(/phase: '([^']+)'/);
  const recoveryMatch = block.match(/isRecoveryWeek: (true|false)/);
  const myWhooshMatch = block.match(/myWhooshWorkout: '([^']+)'/);

  // Extract detail object
  let detail = null;
  const detailMatch = block.match(/detail: \{([^}]+)\}/s);
  if (detailMatch) {
    const detailBlock = detailMatch[1];
    detail = {};
    const warmupMatch = detailBlock.match(/warmup: '([^']+)'/);
    const mainMatch = detailBlock.match(/main: '([^']+)'/);
    const cooldownMatch = detailBlock.match(/cooldown: '([^']+)'/);
    const cadenceMatch = detailBlock.match(/cadence: '([^']+)'/);
    const hrMatch = detailBlock.match(/heartRate: '([^']+)'/);

    if (warmupMatch) detail.warmup = warmupMatch[1];
    if (mainMatch) detail.main = mainMatch[1];
    if (cooldownMatch) detail.cooldown = cooldownMatch[1];
    if (cadenceMatch) detail.cadence = cadenceMatch[1];
    if (hrMatch) detail.heartRate = hrMatch[1];
  }

  if (dateMatch) {
    workouts.push({
      date: dateMatch[1],
      dayOfWeek: dayMatch ? dayMatch[1] : '',
      type: typeMatch ? typeMatch[1] : '',
      title: titleMatch ? titleMatch[1] : '',
      duration: durationMatch ? parseInt(durationMatch[1]) : 0,
      tss: tssMatch ? parseInt(tssMatch[1]) : null,
      description: descMatch ? descMatch[1] : '',
      week: weekMatch ? parseInt(weekMatch[1]) : 0,
      phase: phaseMatch ? phaseMatch[1] : '',
      isRecoveryWeek: recoveryMatch ? recoveryMatch[1] === 'true' : false,
      myWhooshWorkout: myWhooshMatch ? myWhooshMatch[1] : null,
      detail: detail
    });
  }
}

const schedule = {
  ftp_current: ftpCurrentMatch ? parseInt(ftpCurrentMatch[1]) : 220,
  ftp_target: ftpTargetMatch ? parseInt(ftpTargetMatch[1]) : 250,
  plan_start: planStartMatch ? planStartMatch[1] : '2025-12-13',
  plan_end: planEndMatch ? planEndMatch[1] : '2026-03-07',
  generated_at: new Date().toISOString(),
  weeks: weekSummaries,
  workouts: workouts
};

// Write to public folder
const outputPath = path.join(__dirname, '..', 'public', 'schedule.json');
fs.writeFileSync(outputPath, JSON.stringify(schedule, null, 2));

console.log(`Generated schedule.json with ${workouts.length} workouts and ${weekSummaries.length} weeks`);
