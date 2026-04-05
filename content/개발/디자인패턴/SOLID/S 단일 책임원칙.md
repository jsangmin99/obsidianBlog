---
title: SOLID - S 단일 책임 원칙
description: SOLID의 첫 번째 원칙인 단일 책임 원칙이 무엇인지와 왜 유지보수성에 중요한지 예시와 함께 설명합니다.
tags:
  - 디자인패턴
  - SOLID
comments: true
---
- 자바개발자라면 무조건 알고있어야 하는것중 하나인 SOLID 원칙에 대해 설명해보겠다
- 소프트웨어 개발에서 코드의 유지보수성과 확장성을 높이기 위해 객체지향 프로그래밍에서 제시된 SOLID 원칙은 5가지 규칙의 앞글자를 따온 것이다.
1. **S** - 단일 책임 원칙 (Single Responsibility Principle)
2. **O** - 개방-폐쇄 원칙 (Open-Closed Principle)
3. **L** - 리스코프 치환 원칙 (Liskov Substitution Principle)
4. **I** - 인터페이스 분리 원칙 (Interface Segregation Principle)
5. **D** - 의존 역전 원칙 (Dependency Inversion Principle)

- 영어를 한국어로 번역해 놔서 뭐가 뭔지 어렵다...

## 1. 단일 책임 원칙
"클래스는 하나의 책임만 가져야 한다."
- 여기서 "책임"이라는 말은 하나의 클래스가 하나의 기능이나 역할에 집중해야한다는 것을 의미한다.
- 클래스가 여러 책임을가지게 된다면 수정하게될 경우 손봐야 할것들이 많으며 유지보수성이 복잡해진다.

적용방법
- 클래스를 설계할때 해당 클래스의 역활을 명확히 정의한다.
- 만약 하나의 클래스에 여러 역할이 섞여 있다면 이를 분리하여 각 역할에 맞는 클래스를 만들어야한다.

스프링 부트를 직접 만들어보며 안좋은 예시와 좋은 예시를 통해 설명해 보겠다.
### 1-1 안좋은 예시
```java
@Service
public class FileService {

    private final FileRepository fileRepository;

    public FileService(FileRepository fileRepository) {
        this.fileRepository = fileRepository;
    }

    public void validateUploadFile(MultipartFile file) {
        try {
            // 파일 저장
            fileRepository.save(file);

            // 파일 크기 체크
            if (file.getSize() > 10 * 1024 * 1024) { // 10MB 제한
                throw new IllegalArgumentException("파일 크기가 너무 큽니다.");
            }

            // 파일 타입 체크
            String fileType = file.getContentType();
            if (!fileType.startsWith("image/")) {
                throw new IllegalArgumentException("이미지 파일만 업로드 가능합니다.");
            }

            // 파일 업로드 후 성공 로그
            System.out.println("제한된 파일 업로드 성공: " + file.getOriginalFilename());

        } catch (Exception e) {
            System.out.println("제한된 파일 업로드 실패: " + e.getMessage());
        }
    }
    
    public void uploadFile(MultipartFile file) {
        try {
            // 파일 저장
            fileRepository.save(file);

            // 파일 업로드 후 성공 로그
            System.out.println("파일 업로드 성공: " + file.getOriginalFilename());

        } catch (Exception e) {
            System.out.println("파일 업로드 실패: " + e.getMessage());
        }
    }
}


```

문제점
- FileService 클래스에는  파일 저장, 파일 크기 체크, 파일 타입 체크, 업로드 로그의 기능을 가지고 있다.
- 이 경우 파일 업로드의 방식을 바꾸고 싶으면 어떡하지??
- 타입을 바꾸거나 크기를 변경하고 싶으면 어떡하지?
-  로그의 출력 방식을 바꾸고 싶으면 어떡하지?
-  이 경우 코드를 전부 읽어야해서 유지보수성이 떨어진다.

### 1-2 단일책임 원칙을 지킨 예시
```java
@Service
public class FileService {
    private final FileRepository fileRepository;
    private final FileValidator fileValidator;
    private final LoggingService loggingService;

    public FileService(FileRepository fileRepository, FileValidator fileValidator, LoggingService loggingService) {
        this.fileRepository = fileRepository;
        this.fileValidator = fileValidator;
        this.loggingService = loggingService;
    }

    public void validateUploadFile(MultipartFile file) {
        // 파일 유효성 검사
        fileValidator.validate(file);

        // 파일 저장
        fileRepository.save(file);

        // 업로드 후 성공 로그
        loggingService.log("제한된 파일 업로드 성공: " + file.getOriginalFilename());
    }

    public void uploadFile(MultipartFile file) {

        // 파일 저장
        fileRepository.save(file);

        // 업로드 후 성공 로그
        loggingService.log("파일 업로드 성공: " + file.getOriginalFilename());
    }
}
```

```java
@Service
public class FileValidator {
    public void validate(MultipartFile file) {
        // 파일 크기 체크
        if (file.getSize() > 10 * 1024 * 1024) { // 10MB 제한
            throw new IllegalArgumentException("파일 크기가 너무 큽니다.");
        }

        // 파일 타입 체크
        String fileType = file.getContentType();
        if (!fileType.startsWith("image/")) {
            throw new IllegalArgumentException("이미지 파일만 업로드 가능합니다.");
        }
    }
}
```

```java
@Service
public class LoggingService {
    public void log(String message) {
        // 로깅 로직
        System.out.println("Log: " + message);
    }
}
```

개선한 것
- FileService 는 파일업로드만 담당한다.
- FileValidator 는 파일의 유효성 검사(크기체크, 타입체크) 만 담당한다.
- LoggingService 는 로그 출력만 담당한다.
- 각 클래스가 하나의 책임만 가지므로 각 책임을 독립적으로 변경하거나 확장할수있다.
- 예를 들어 파일 크기를 변경하고 싶다면 FileValidator만 수정하면 되고 로그를 다른방식으로 출력하고 싶다면 LoggingService만 수정하면 된다.

이로 인해 확정성 및 유지보수성이 높아진다.
