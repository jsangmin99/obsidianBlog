# Blog Frontmatter Guide

공개 글에는 아래 항목을 기본으로 넣는다.

## 최소 권장 항목

```yaml
---
title: 글 제목
description: 검색 결과와 공유 미리보기에 노출될 1~2문장 요약
tags:
  - 주제
  - 기술
comments: true
---
```

## 발행 제어

- `publish: false` 이면 발행하지 않음
- `dg-publish: false` 이면 발행하지 않음
- 둘 다 없으면 기본 발행

## 댓글 제어

- `comments: false` 이면 해당 글에서 Giscus 비활성화
- 값이 없으면 기본 활성화

## 작성 원칙

- `title`은 파일명과 같아도 넣는다
- `description`은 80~160자 내외로 작성한다
- `tags`는 2~5개 정도로 유지한다
- 초안은 `publish: false`로 두고 공개 시 제거하거나 `true`로 바꾼다
