---
tags: git, submodule
publish: true
---
# 1. Submodule 이란?
- 레포지토리가 여러개로 분산되어 있는데 이를 한군데서 관리하느것이 쉽지 않다.
- 그냥 한 레포에 여러 폴더를 이동시켜 합칠수도 있는데 이럴경우 각각의 버전관리가 쉽지 않다.
- Git에서 지원하느 submodule 기능을 이용해 레포끼리 연결을 시켜 한곳에서 관리도 하고 버전관리또한 각각 이뤄질수 있도록한다.
- 나는 쉽게 생각하여 git용 심볼릭 링크라고 쉽게 이해하였다.


# 2. Submodule 사용하기
- 나는 ObisidianFolder 라는 Vault(폴더)를 개인적인 내용을 작성하고 있다.  그리고 ObsidianBlog 라는 Vault를 따로 만들어 블로그를 배포를 하는 상황이다
	- ObsidianFolder -> private repo
	- ObsidianBlog -> public repo
- 따라서 글 작성을 편리하게 하기위해 ObsidianFolder 안에 5.blog 폴더를 만들어 한군데서 관리를 하려고 한다.

- 상위 프로젝트`~/Obsidian/obsidian/ObsidianFolder/5.blog` 안에, 외부 GitHub 저장소 `https://github.com/me/ObsidianBlog`를 `ObsidianBlog`라는 이름으로 submodule로 추가하고자 함.
---

## 2- 1. 📍 상위 프로젝트 디렉토리로 이동

``` bash
cd ~/ObsidianFolder/5.blog
```

> 나와같은경우는 5.blog 안에 하위모듈(ObsidianBlog Repo) 를 넣을것이다.
---

## 2-2. ➕ Submodule 추가
``` bash
git submodule add [서브모듈(레포)의 깃허브주소] [이름]
```

> 예시 :  git submodule add  https://github.com/me/my-main-repo.git ObsidianBlog

- `ObsidianBlog`는 현재 경로 기준으로 만들어질 폴더명이다. 이 명령어로 `.gitmodules` 파일도 자동 생성된다
---

## 2-3. 🗂 변경사항 스테이징 후 커밋

``` bash
git add .gitmodules ObsidianBlog 
git commit -m "ObsidianBlog 라는 서브모듈 생성" 
git push origin main
```

> 반드시 `.gitmodules`와 서브모듈 폴더를 함께 커밋해야 한다.

---

## 2-4. 🧑‍💻 다른 사용자가 clone 받을 경우
``` bash
git clone --recurse-submodules https://github.com/me/my-main-repo.git
```

> 이미 clone 했는데 서브모듈 폴더가 비어있다면:
``` bash
git submodule init git submodule update
```

---

## 2-5. 🔄 Submodule 내용 최신화할 때
``` bash
cd ObsidianFolder/5.blog/ObsidianBlog        # 서브모듈 디렉토리로 이동 
git checkout main      # 작업 브랜치로 이동 (필요시) 
git pull origin main   # 최신 커밋 가져오기 
cd ..                  # 다시 상위 프로젝트로  # 서브모듈 업데이트 내용을 상위 레포에 반영 
git add ObsidianBlog 
git commit -m "Update submodule to latest commit" 
git push origin main
```
---

## 📌 주의사항 요약
| 상황             | 조치                                                   |
| -------------- | ---------------------------------------------------- |
| 다른 컴퓨터에서 clone | `--recurse-submodules` 또는 `submodule init && update` |
| 서브모듈에서 직접 작업 시 | `push`까지 해야 상위 레포가 가리키는 커밋이 유효                       |
| 서브모듈 경로 변경 시   | `.gitmodules`와 `.git/config` 모두 수정 필요                |
