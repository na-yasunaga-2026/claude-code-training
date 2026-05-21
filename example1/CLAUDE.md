# CLAUDE.md — example1

Next.js 16ハンズオン用プロジェクト。Claude Codeでの開発を支援するため、このファイルに開発ガイドを記述しています。

## プロジェクト概要

- **フレームワーク**: Next.js 16 (App Router / Turbopack)
- **言語**: TypeScript 5
- **テスト**: Vitest 4
- **リンター**: ESLint 9

## ディレクトリ構成

```
example1/
├── src/
│   ├── app/                 # App Router
│   │   ├── api/health/      # ヘルスチェックAPI (route.ts)
│   │   ├── layout.tsx       # ルートレイアウト
│   │   ├── page.tsx         # ホームページ
│   │   ├── page.module.css
│   │   └── globals.css
│   └── lib/
│       └── types.ts         # 共有型定義
├── public/                  # 静的ファイル
├── vitest.config.ts         # Vitestテスト設定
├── next.config.ts           # Next.js設定
├── eslint.config.mjs        # ESLint設定
├── tsconfig.json            # TypeScript設定
└── package.json
```

## 開発コマンド

```bash
# 開発サーバー起動（Turbopack）
npm run dev

# ビルド
npm run build

# 本番サーバー起動
npm start

# リント実行
npm run lint

# テスト実行
npm run test              # 1回実行
npm run test:watch        # 監視モード
npm run test:ui           # Vitest UI
npm run test:coverage     # カバレッジ計測
```

## 重要な注意点

### TypeScript

- すべてのコンポーネント・関数は型安全性を確保する
- `src/lib/types.ts` に共有型を集約

### App Router

- `src/app/` 配下のディレクトリ構造 = ルーティング
- `page.tsx` がページコンポーネント、`route.ts` がAPIハンドラ
- デフォルトではServer Components

### テスト（Vitest）

- `src/app/api/health/` に `route.test.ts` として配置
- happy-dom環境でブラウザAPIをシミュレート
- カバレッジは `@vitest/coverage-v8` で計測

## 出力言語

**日本語で出力すること** - すべての説明・コメント・提案は日本語で記述

## 関連タスク

親ディレクトリの `../issues/task*.md` を参照して段階的に学習してください。

- task1〜task3: Claude Code基本
- task5〜task6: Skills・サブエージェント
- task7: ペアプログラミング（新機能実装）
- task9: Vitestでテスト作成
