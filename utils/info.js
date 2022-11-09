const numCpus=require('os').cpus().length

const info = {
  title: process.title,
  platform: process.platform,
  node: process.version,
  memory: process.memoryUsage().rss,
  path: process.execPath,
  pid: process.pid,
  folder: process.cwd(),
  numCpus: numCpus
};

module.exports = info;