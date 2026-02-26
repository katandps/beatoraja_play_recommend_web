#!/usr/bin/env node
// JSON Schema から TypeScript 型定義を生成するスクリプト (quicktype使用)
const { execSync } = require("child_process")
const path = require("path")
const fs = require("fs")

const SCHEMA_DIR = path.join(__dirname, "../src/types/schemas")
const OUTPUT_DIR = path.join(__dirname, "../src/types/generated")
fs.mkdirSync(OUTPUT_DIR, { recursive: true })

const files = fs.readdirSync(SCHEMA_DIR).filter((f) => f.endsWith(".json"))
if (files.length === 0) {
  console.error("スキーマファイルが見つかりませんでした。")
  process.exit(1)
}

let hasError = false
for (const file of files) {
  const schemaPath = path.join(SCHEMA_DIR, file)
  const baseName = path.basename(file, ".json")
  const outputPath = path.join(OUTPUT_DIR, `${baseName}.d.ts`)
  const cmd = `npx quicktype --lang typescript --src-lang schema -o "${outputPath}" "${schemaPath}"`
  try {
    execSync(cmd, { stdio: "inherit" })
    console.log(`型定義ファイルを生成しました: ${outputPath}`)
  } catch (e) {
    console.error(`型定義生成に失敗しました: ${file}:`, e.message)
    hasError = true
  }
}
if (hasError) process.exit(1)
