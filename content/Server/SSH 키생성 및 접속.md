---
dg-home: true
dg-publish: true
tags: server, ssh
---

## 클라이언트에서 SSH 키 생성
#### 키생성
```sh
ssh-keygen -t ed25519 -f ~/.ssh/client key
```
- ls ~/.ssh
```
[rocky@client .ssh]$ ls ~/.ssh
client_key  client_key.pub
```
- 그러면 두 개의 파일이 생성됨
	- `~/.ssh/client_key` → **개인키 (절대 노출 금지)**
	- `~/.ssh/client_key.pub` → **공개키 (서버에 전달할 것)**
#### 공개키를 서버로 복사
```sh
ssh-copy-id -i ~/.ssh/client_key.pub 사용자명@서버IP 
```
- 서버에서 비밀번호 금지시에는 안됨

#### 접속 
``` sh 
ssh -i ~/.ssh/client_key 사용자명@서버IP 
```


## 뭔가 새로 생겼다
키생성시 클라이언트는 가 `~/` 경로에 `.ssh`  생겼고
서버는 ssh 키 이동시 `~/` 경로에 `.ssh` 가 생겼다.

서버에는 `authorized_keys` 클라이언트에는 `known_hosts`, `known_hosts.old` 가 생겼다.
`authorized_keys` 에는 접속을 허용할 클라이언트의 공개키 목록
`known_hosts` 는 접속했던 서버의 공개키 목록이다

## 근데 ssh-copy-id와 scp는 뭐가 다른데?
| 구분          | `ssh-copy-id`                       | `scp`                                                            |
| ----------- | ----------------------------------- | ---------------------------------------------------------------- |
| **무엇을 복사?** | 공개키 파일 (`.pub`)                     | 일반 파일 (예: `.txt`, `.zip`)                                        |
| **복사 위치**   | 서버의 `~/.ssh/authorized_keys`에 자동 추가 | 지정한 서버 디렉터리 (예: `/home/user/file.txt`)                           |
| **용도**      | 키 기반 **SSH 로그인 설정**                 | 서버 ↔ 클라이언트 간 **파일 전송**                                           |
| **자동 처리**   | 공개키 파일만 옮기고, **권한 설정까지 자동으로 처리**    | 그냥 파일 복사만 함 (권한 설정 X)<br>직접 `authorized_keys`에 복사하고, 권한도 설정해야 작동 |
| **실행 후 변화** | 서버는 키를 등록하고 **비밀번호 없이 접속 가능**       | 서버는 파일만 받고, SSH 설정은 바뀌지 않음                                       |
> 설정을 해주는것이 귀찮기 때문에 `ssh-copy-id`를 하는것인 더 좋아보인다.