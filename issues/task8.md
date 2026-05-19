# Task 8: Git操作とCI/CD - コード品質を自動保証しよう

## 目的
Claude Codeを使ってGit操作を効率化し、GitHub Actionsでコード品質を自動チェックするCI/CDパイプラインを構築する

## 所要時間
約40-50分

## 前提条件
- Task 1-7が完了していること
- GitHubアカウントを持っていること
- example1プロジェクトが存在すること
- Gitの基本操作を理解していること

## このタスクで学ぶこと
- Claude Codeを使った効率的なGit操作
- Biomeによる高速なコードフォーマット・リント
- GitHub Actionsを使ったCI/CD構築
- PRベースの開発フロー
- CI失敗時の対処方法

## 🎯 ミッション

**example1プロジェクトにBiomeを導入し、GitHub Actionsでコードフォーマットとリントを自動チェックするCIを構築してください！**

## 📚 Biomeとは？

[Biome](https://biomejs.dev/)は、Rustで書かれた超高速なWeb開発ツールチェーンです。

### 特徴
- ⚡ **高速**: Prettierの約35倍の速度
- 🔧 **オールインワン**: フォーマッター + リンター
- 🎯 **ゼロ設定**: すぐに使い始められる
- 🌍 **多言語対応**: JavaScript, TypeScript, JSX, JSON, CSS, HTML
- 🔒 **型安全**: 390以上のルールでコード品質を保証

### なぜBiomeを使うのか？

| ツール | 役割 | 特徴 |
|-------|------|------|
| **Biome** | フォーマット + リント | 高速、オールインワン、設定不要 |
| ESLint | リント | 多機能だが遅い |
| Prettier | フォーマット | 広く使われているが遅い |

**Biome = ESLint + Prettier を高速に置き換え**

## 🚀 実装の進め方

### ステップ1: Biomeをインストールする（5分）

#### 1-1. Claude Codeに依頼する

```
example1プロジェクトにBiomeをインストールしたいです。

以下を実行してください：
1. @biomejs/biome を devDependencies にインストール
2. package.json にBiome用のスクリプトを追加
   - format: コードフォーマット
   - lint: リント
   - check: フォーマット + リント
```

#### 1-2. 期待される結果

Claude Codeが以下を実行します：

```bash
cd example1
npm install --save-dev --save-exact @biomejs/biome
```

`package.json`に以下のスクリプトが追加されます：

```json
{
  "scripts": {
    "format": "biome format --write ./src",
    "lint": "biome lint --write ./src",
    "check": "biome check --write ./src"
  }
}
```

#### 1-3. 動作確認

```bash
npm run check
```

を実行して、Biomeが動作することを確認してください。

### ステップ2: Biome設定ファイルを作成する（5分）

#### 2-1. Claude Codeに依頼する

```
example1プロジェクトのBiome設定ファイル（biome.json）を作成してください。

以下の設定を含めてください：
- フォーマッター: インデント幅2、セミコロン有効
- リンター: 推奨ルールを有効化
- Next.js 16に適した設定
- TypeScriptとJSX対応
```

#### 2-2. 期待される設定例

`example1/biome.json`:

```json
{
  "$schema": "https://biomejs.dev/schemas/2.4.0/schema.json",
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true
    }
  },
  "formatter": {
    "enabled": true,
    "formatWithErrors": false,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 100
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "double",
      "semicolons": "always"
    }
  },
  "assist": {
    "actions": {
      "source": {
        "organizeImports": "on"
      }
    }
  },
  "files": {
    "includes": [
      "**",
      "!node_modules",
      "!.next",
      "!out",
      "!dist",
      "!build"
    ]
  }
}
```

> ℹ️ Biome v2 系から設定スキーマが変更されました（旧 `organizeImports` は `assist.actions.source.organizeImports` に、`files.ignore` は `files.includes` の否定パターンに移行）。常に最新スキーマに揃えるには `npx @biomejs/biome migrate --write` を実行できます。

#### 2-3. 設定の意味を理解する

Claude Codeに質問してみましょう：

```
作成したbiome.jsonの各設定項目について説明してください：
1. assist.actions.source.organizeImports とは？（旧 organizeImports）
2. linter.rules.recommended には何が含まれる？
3. formatter の各オプションの意味は？
4. files.includes の `!` 否定パターンの意味は？（旧 files.ignore）
```

### ステップ3: ローカルでフォーマットを実行する（5分）

#### 3-1. 既存コードをフォーマット

```bash
npm run check
```

を実行して、Biomeが検出した問題を確認してください。

#### 3-2. 問題があった場合

Claude Codeに相談：

```
Biomeで以下のエラーが出ました：

[エラーメッセージをコピー]

これらのエラーを修正してください。
```

#### 3-3. コミット前のチェック習慣

今後、コードを変更したら必ず実行：

```bash
npm run check
```

これで：
- ✅ フォーマットが統一される
- ✅ 潜在的なバグが検出される
- ✅ コード品質が保たれる

### ステップ4: GitHub Actionsを設定する（10分）

#### 4-1. ワークフローファイルを作成

Claude Codeに依頼：

```
example1プロジェクトにGitHub Actionsのワークフローを作成してください。

ファイル: .github/workflows/ci.yml

以下の内容を含めてください：
1. PRが作成されたときに自動実行
2. Node.js 20を使用
3. 依存関係をインストール
4. Biomeでコードフォーマットとリントをチェック
5. チェックが失敗したらPRをマージできないようにする
```

#### 4-2. 期待されるワークフロー

`example1/.github/workflows/ci.yml`:

```yaml
name: CI

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

jobs:
  code-quality:
    name: Code Quality Check
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: example1/package-lock.json

      - name: Install dependencies
        working-directory: example1
        run: npm ci

      - name: Run Biome format check
        working-directory: example1
        run: npx @biomejs/biome format ./src

      - name: Run Biome lint
        working-directory: example1
        run: npx @biomejs/biome lint ./src

      - name: Run Biome check
        working-directory: example1
        run: npx @biomejs/biome check ./src
```

#### 4-3. ワークフローの理解

Claude Codeに質問：

```
作成したGitHub Actionsワークフローについて説明してください：
1. on.pull_request の意味は？
2. ubuntu-latest とは？
3. actions/checkout@v4 は何をする？
4. npm ci と npm install の違いは？
5. working-directory はなぜ必要？
```

### ステップ5: 新しいブランチでPRを作成する（10分）

#### 5-1. 新しい機能ブランチを作成

Claude Codeに依頼：

```
新しい機能を追加するブランチを作成してください。

1. ブランチ名: feature/add-biome-ci
2. example1/src/app/page.tsx に簡単な変更を加える
   （例: ページタイトルを変更）
3. Biomeでフォーマットをチェック
4. 変更をコミット
5. リモートブランチにプッシュ
```

#### 5-2. Claude Codeが実行すること

```bash
# ブランチ作成
git checkout -b feature/add-biome-ci

# ファイル編集（Claude Codeが実行）
# ...

# フォーマットチェック
cd example1
npm run check

# コミット
git add .
git commit -m "feat: BiomeとGitHub Actions CIを追加

- BiomeをdevDependenciesに追加
- biome.json設定ファイルを作成
- GitHub Actions CIワークフローを追加
- コードフォーマットを統一

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"

# プッシュ
git push -u origin feature/add-biome-ci
```

#### 5-3. PRを作成

Claude Codeに依頼：

```
feature/add-biome-ci ブランチからmainブランチへのPRを作成してください。

タイトル: BiomeとGitHub Actions CIの導入
本文: 以下を含めてください
- 変更内容の概要
- Biomeの導入理由
- CIで何をチェックするか
- テスト手順
```

または、Skill を使用：

```
/create-pr
```

### ステップ6: CIの動作を確認する（5分）

#### 6-1. GitHub上でCIの実行状況を確認

PRを作成すると、GitHub Actionsが自動的に実行されます。

Claude Codeに確認を依頼：

```
作成したPRのCI実行状況を確認したいです。
GitHub CLIを使って、PRの状態とCIのチェック結果を表示してください。
```

#### 6-2. 期待されるコマンド

```bash
# PR一覧を表示
gh pr list

# 特定のPRの詳細を表示
gh pr view [PR番号]

# CIのチェック状態を確認
gh pr checks [PR番号]
```

#### 6-3. CIが成功した場合

✅ すべてのチェックが緑色になります：
- ✅ Code Quality Check
  - ✅ Biome format check
  - ✅ Biome lint
  - ✅ Biome check

## 🎓 重要な概念の理解

### CI/CDとは？

- **CI (Continuous Integration)**: コードを頻繁に統合し、自動テスト
- **CD (Continuous Deployment)**: テスト通過後、自動デプロイ

このタスクではCIを構築しました。

### なぜCIが重要？

| 従来の開発 | CI導入後 |
|----------|---------|
| 手動でフォーマット確認 | 自動チェック |
| レビュアーが品質チェック | 機械が事前チェック |
| マージ後に問題発覚 | マージ前に問題検出 |
| チームの規約がバラバラ | 統一されたコード品質 |

### PRベース開発のベストプラクティス

1. **小さなPR**: 1つの機能・修正に集中
2. **説明的なタイトル**: 何を変更したか一目で分かる
3. **CI必須**: すべてのチェックが通るまでマージしない
4. **レビュー**: 最低1人のレビューを受ける

## ✅ 確認事項

- [ ] Biomeをインストールした
- [ ] biome.json設定ファイルを作成した
- [ ] npm run check でローカルチェックができる
- [ ] GitHub Actionsワークフローを作成した
- [ ] 機能ブランチを作成できた
- [ ] Claude Codeでコミットメッセージを生成できた
- [ ] PRを作成できた
- [ ] CIが正常に実行されることを確認した
- [ ] CI失敗時の対処方法を理解した
