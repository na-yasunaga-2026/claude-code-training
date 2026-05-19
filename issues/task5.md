# Task 5: Skill を作成する

## 目的
Claude Code の Skills 機能を理解し、プロジェクト固有の Skill を作成する

## 所要時間
約20分

## 前提条件
- Task 1-4が完了していること
- `.claude`ディレクトリが存在すること

## Skill とは？

Skill（`/<skill-name>`）は、よく使う指示や手順を `.claude/skills/<name>/SKILL.md` に保存しておき、スラッシュ呼び出し・description マッチによる自動起動・チームでの共有ができる Claude Code の公式拡張機構です。

> ℹ️ 旧 `.claude/commands/` 形式（Custom Commands）は、公式が **Skills へ統合する方向** で案内しており、本プロジェクトでも `.claude/skills/` に統一しています。新規作成は必ず Skills 形式で行ってください。

### メリット
- 繰り返し使う指示を簡単に呼び出せる
- `description` で自動起動条件を制御できる
- `allowed-tools` で利用ツールを最小権限に絞れる
- `argument-hint` で `$ARGUMENTS` 入力のヒントを表示できる
- チーム全体で共通の Skill を Git で共有できる

## 実践課題

### 課題1: Skill ファイルの保存場所を理解する

Skill は以下の **ディレクトリ単位** で保存します（フラットなファイル1枚ではなく、各 Skill が自分のディレクトリを持ちます）。

```
.claude/skills/<skill-name>/SKILL.md
```

オプションで同じディレクトリ内に補助ファイル（`reference.md` など）を置けます。

### 課題2: 最初の Skill を作成する

#### 1. skills ディレクトリと skill ディレクトリを作成

```bash
mkdir -p .claude/skills/review
```

#### 2. レビュー Skill を作成

`.claude/skills/review/SKILL.md` を作成します：

```markdown
---
name: review
description: 現在開いているファイルや指定対象のコードを、可読性・パフォーマンス・セキュリティ・ベストプラクティスの観点でレビューする
allowed-tools: Read, Grep, Glob
---

現在開いているファイルのコードをレビューしてください。

以下の観点でチェックしてください：
- コードの可読性
- パフォーマンス
- セキュリティ
- ベストプラクティスに従っているか
- 改善提案

レビュー結果は日本語で、具体的に説明してください。
```

#### 3. Skill を使用

Claude Code で以下のように入力：

```
/review
```

これで、ファイルのコードレビューが実行されます！

### 課題3: より実用的な Skill を作成する

#### テスト Skill（`.claude/skills/test/SKILL.md`）

```markdown
---
name: test
description: 現在のファイルに対応するテストを探して実行する。なければ新規作成する
allowed-tools: Read, Write, Edit, Glob, Bash(npm test:*), Bash(npx vitest:*)
---

以下の手順でテストを実行してください：

1. 現在のファイルに対するテストファイルを探す
2. テストが存在する場合は実行する
3. テストが存在しない場合は、適切なテストファイルを作成する
4. テスト結果を報告する

Next.jsプロジェクトなので、Vitestを使用してください。
```

#### リファクタリング Skill（`.claude/skills/refactor/SKILL.md`）

```markdown
---
name: refactor
description: 現在のファイルを、重複削除・関数分割・命名改善・型の整備の観点でリファクタリングする
allowed-tools: Read, Edit, Grep
---

現在のファイルをリファクタリングしてください。

以下の観点で改善してください：
- コードの重複を削除
- 関数を適切なサイズに分割
- 変数名をわかりやすくする
- TypeScriptの型を適切に使用
- コメントを追加（必要に応じて）

変更内容と理由を説明してください。
```

#### ドキュメント生成 Skill（`.claude/skills/doc/SKILL.md`）

```markdown
---
name: doc
description: 現在のファイルの概要・関数説明・使用例・注意点を含むドキュメントを生成し、README に追加できる形式で出力する
allowed-tools: Read, Grep, Glob
---

現在のファイルのドキュメントを生成してください。

以下を含めてください：
- ファイルの概要
- 主要な関数/コンポーネントの説明
- 使用例
- 注意点

日本語で、README.mdに追加できる形式で出力してください。
```

### 課題4: 引数を受け取る Skill を作成

Skill は `$ARGUMENTS` で引数を受け取れます（個別位置引数 `$1` `$2` も使えます）。

#### 引数の使い方

- `$ARGUMENTS` - すべての引数を取得
- `$1`, `$2`, `$3`... - 個別の引数を取得（スペース区切り）
- `argument-hint` を frontmatter で書くと、補完表示に使われます

#### コンポーネント作成 Skill（`.claude/skills/component/SKILL.md`）

```markdown
---
name: component
description: Next.js 16 用の React コンポーネントを TypeScript / Tailwind CSS / JSDoc 付きで指定名で生成する
allowed-tools: Read, Write, Glob
argument-hint: <component-name>
---

Next.js 16のReactコンポーネント「$1」を作成してください。

以下を含むファイルを作成：
- TypeScriptを使用
- 関数コンポーネント
- Propsの型定義
- 基本的なスタイリング（Tailwind CSS）
- JSDocコメント

作成場所：`components/$1.tsx`
```

**Frontmatter の主な項目:**
- `name`: Skill の識別子（必須、ファイル名と揃える）
- `description`: 発火条件の説明（必須、トリガーキーワードを前半に置く）
- `allowed-tools`: 利用可能なツール（最小権限に絞る）
- `argument-hint`: 引数のヒント（補完表示）
- `disable-model-invocation`: 副作用ありの Skill では `true` を設定して自動起動を防ぐ

**使用例：**
```
/component Button
```

これで、`components/Button.tsx` が作成されます。`$1` が "Button" に置き換わります。

#### PR作成 Skill（複数引数の例）

`.claude/skills/create-pr/SKILL.md`:

```markdown
---
name: create-pr
description: 指定ブランチからのPull Requestを、タイトル・本文付きで作成する
allowed-tools: Bash(git:*), Bash(gh:*)
argument-hint: <branch-name> <title>
disable-model-invocation: true
---

ブランチ「$1」からPull Requestを作成してください。

タイトル: $2
説明: 変更内容を要約してください

以下を実行：
1. 変更をコミット
2. ブランチをプッシュ
3. GitHub PRを作成
```

> ℹ️ `disable-model-invocation: true` は、PR 作成のように **副作用がある Skill** で自動起動を抑止するための設定です。明示的にスラッシュコマンドで呼び出した時だけ実行されます。

**使用例：**
```
/create-pr feature/new-button "Add new button component"
```

### 課題5: 高度な機能を活用する

#### Bash コマンドの実行

`!` で始まる行は Bash コマンドとして実行されます。

`.claude/skills/build-and-test/SKILL.md`:

```markdown
---
name: build-and-test
description: プロジェクトのビルドとテストを順番に実行し、結果を要約する
allowed-tools: Bash(npm:*)
---

プロジェクトをビルドしてテストを実行します。

!npm run build
!npm test

結果を報告してください。
```

#### ファイルの参照

`@` でファイルを参照できます。

`.claude/skills/review-with-standards/SKILL.md`:

```markdown
---
name: review-with-standards
description: プロジェクトのコーディング規約に従って、現在のファイルをレビューし問題点と修正案を提示する
allowed-tools: Read, Grep, Glob
---

以下のコーディング規約に従って、現在のファイルをレビューしてください：

@docs/coding-standards.md

問題点を指摘し、修正案を提示してください。
```

#### `$ARGUMENTS` の活用

すべての引数をまとめて取得する例。

`.claude/skills/commit/SKILL.md`:

```markdown
---
name: commit
description: 指定されたメッセージを Conventional Commits 形式に整形してコミットする
allowed-tools: Bash(git:*)
argument-hint: <commit-message...>
disable-model-invocation: true
---

以下のメッセージで変更をコミットしてください：

$ARGUMENTS

Conventional Commits形式に従って、コミットメッセージを整形してからコミットを実行してください。
```

**使用例：**
```
/commit feat: add new authentication system
```

すべての引数が1つのメッセージとして扱われます。

### 補助ファイル（progressive disclosure）

SKILL.md が長くなりそうなときは、同じディレクトリに `reference.md` などの補助ファイルを置き、SKILL.md からは概要だけ + 参照リンクの形にできます。

```
.claude/skills/review/
├── SKILL.md          # 概要・トリガー・最小手順
└── reference.md      # 詳細チェックリスト・テンプレート
```

公式は **SKILL.md 単体は500行未満** を推奨しています。

## Skill の実践

それぞれの Skill を実際に使ってみましょう：

1. `example1/src/app/page.tsx` を開く
2. `/review` を実行してコードレビューを受ける
3. `/refactor` で改善提案を得る
4. `/component UserCard` で新しいコンポーネントを作成
5. `/test` でテストを作成・実行

## 確認事項

- [ ] `.claude/skills/<name>/` ディレクトリ単位で配置できている
- [ ] 各 SKILL.md に `name` / `description` の frontmatter がある
- [ ] 少なくとも3つの Skill を作成した
- [ ] Skill が正しく動作する
- [ ] Skill の便利さを実感できた

## Skill のベストプラクティス

### 1. わかりやすい名前をつける
- ❌ `c` （何の Skill か不明）
- ✅ `component` （明確）

### 2. description にトリガーキーワードを前半に書く
- description は1,536字で切り詰められるため、発火させたいキーワードを **前半に集中** させる
- ❌ 「コードを丁寧に確認するためのもの」
- ✅ 「現在のファイルをレビューする。可読性・セキュリティ・型を観点に...」

### 3. `allowed-tools` を最小権限に絞る
- 読むだけなら `Read, Grep, Glob`
- Bash は `Bash(git status:*)` のように **コマンドを限定**

### 4. 副作用がある Skill は `disable-model-invocation: true`
- PR 作成、デプロイ、コミット、ファイル削除など
- ユーザーが明示的に `/<skill>` と打った時だけ実行される

### 5. プロジェクトに合わせる
- 使用している技術スタック
- コーディング規約
- チームのワークフロー

### 6. よく使う操作を Skill 化
- コードレビュー
- テスト作成
- リファクタリング
- ドキュメント生成

## グローバル Skill vs プロジェクト Skill

### グローバル Skill
場所：`~/.claude/skills/`
- すべてのプロジェクトで使用可能
- 汎用的な操作向け

### プロジェクト Skill
場所：`<project>/.claude/skills/`
- 特定のプロジェクトでのみ使用
- プロジェクト固有の操作向け（チームで Git 共有）

## 応用課題（発展）

### 1. AIペアプログラミング Skill

```markdown
<!-- .claude/skills/pair/SKILL.md -->
---
name: pair
description: ペアプログラミングモードで対話的に設計から実装・テスト・リファクタまで進める
allowed-tools: Read, Write, Edit, Grep, Glob, Bash(npm:*)
---

ペアプログラミングモードで以下を実行：

1. 実装したい機能を確認
2. 設計を一緒に考える
3. ステップバイステップで実装
4. 各ステップで説明と確認
5. テストを作成
6. リファクタリング

対話的に進めてください。
```

### 2. デバッグサポート Skill

```markdown
<!-- .claude/skills/debug/SKILL.md -->
---
name: debug
description: 現在のファイルまたは指定されたエラーを根本原因まで掘り下げ、修正案を提示する
allowed-tools: Read, Grep, Glob, Bash(npm:*)
---

現在のファイルまたは指定されたエラーをデバッグ：

1. エラーメッセージを分析
2. 関連するコードを確認
3. 原因を特定
4. 修正方法を提案
5. 修正を適用
6. テストで確認

ステップごとに説明してください。
```

### 3. パフォーマンス最適化 Skill

```markdown
<!-- .claude/skills/optimize/SKILL.md -->
---
name: optimize
description: Next.js アプリケーションのパフォーマンスボトルネックを特定し、Server Components/動的インポート/画像最適化等で改善する
allowed-tools: Read, Edit, Grep, Glob
---

Next.jsアプリケーションのパフォーマンスを最適化：

1. 現在のコードを分析
2. パフォーマンスのボトルネックを特定
3. 最適化提案
4. 実装
5. Before/Afterを説明

React Server Components、動的インポート、画像最適化などを活用。
```

## 次のステップ

✅ Skill 作成をマスターしました！

これで基本的な Claude Code の使い方は完了です。

### さらに学ぶには：
1. Claude Code 公式ドキュメント（[Skills](https://code.claude.com/docs/en/skills)）を読む
2. 他のプロジェクトでも活用してみる
3. チームメンバーと Skill を共有する
4. より複雑なワークフローを自動化する

## 振り返り

1. どの Skill が最も便利でしたか？
2. 他にどんな Skill があると便利だと思いますか？
3. チームで共有したい Skill はありますか？

## ヒント

- Skill 本体は `.md` ファイルなので、マークダウンで自由に記述できます
- Skill ディレクトリには補助ファイル（`reference.md` 等）を置けます（progressive disclosure）
- Skill の中で別の Skill を参照することも可能です
- Skill ディレクトリは Git で管理して、チームで共有しましょう
- 定期的に Skill を見直して改善しましょう
