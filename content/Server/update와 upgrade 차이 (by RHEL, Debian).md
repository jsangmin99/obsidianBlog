---
title: update와 upgrade 차이 (by RHEL, Debian)
description: RHEL 계열과 Debian 계열에서 update와 upgrade 명령이 어떻게 다르게 동작하는지 정리한 비교 문서입니다.
dg-home: true
dg-publish: true
tags: server, ubuntu, rocky, linux
comments: true
---

## 1. 내가 기존에 알고있는 방식
- update는 목록만 갱신한다.
- upgrade는 실제로 최신버전으로 버전업을 한다.

## 2. 검증
### 2.1 RHEL(Rocky Linux)
#### Step 1: 현재 설치된 패키지 목록 저장
``` bash
rpm -qa > before.txt
```
#### Step 2: `update` 실행
``` bash
sudo dnf update
```

![[Pasted image 20250706141503.png]]
![[Pasted image 20250706141548.png]]
#### Step 3: 다시 패키지 목록 저장
```bash
rpm -qa > after_update.txt
```
#### Step 4: `upgrade` 실행
``` bash
sudo apt upgrade -y 
sudo dnf upgrade -y
```
- 이미 업그레이드가 되었다고 한다.
![[Pasted image 20250706141927.png]]
#### Step 5: 다시 패키지 목록 저장
```bash
rpm -qa > after_upgrade.txt
```
#### Step 6: 비교 확인
```bash
diff before.txt after_update.txt 
diff after_update.txt after_upgrade.txt
```
![[Pasted image 20250706144909.png]]

#### 결과
>`update`와 `upgrade`는 동일한 동작을 한다. 
### 2.1 Debian(Ubuntu Linux)
#### Step 1: 현재 설치된 패키지 목록 저장
```bash
dpkg -l > before.txt
```
#### Step 2: 패키지 목록 업데이트 (저장소 정보 갱신)
``` bash
sudo apt update
```
#### Step 3: 다시 패키지 목록 저장
```bash
dpkg -l > after_update.txt
```
- `update` 명령은 **설치된 패키지 버전이 최신인지 확인하기 위해 저장소 정보만 새로고침**
- 실제로 패키지는 아무것도 설치되거나 변경되지 않음
#### Step 4: 업그레이드 수행
```bash
sudo apt upgrade -y
```
#### Step 5: 다시 패키지 목록 저장
```bash
dpkg -l > after_upgrade.txt
```
- `upgrade` 명령은 **업데이트 가능한 패키지만 업그레이드**하며, 의존성 문제로 **새 패키지 설치나 기존 패키지 제거는 하지 않음**.
#### Step 6: 패키지 목록 비교
``` bash
diff before.txt after_update.txt             # → 차이 없어야 정상 
diff after_update.txt after_upgrade.txt      # → 일부 패키지 버전 업 
```
![[Pasted image 20250706144555.png]]
#### 결과
- update는 목록만 갱신한다.
- upgrade는 실제로 최신버전으로 버전업을 한다.

## 최종
- Debian 환경에서는 `update` 는 최신목록 새로고침 `upgrade` 실제 버전 업그레이드
- RHEL 환경에서는 `update` == `upgrade` , update에서 Y/N 로 업그레이드 할지말지 선택
