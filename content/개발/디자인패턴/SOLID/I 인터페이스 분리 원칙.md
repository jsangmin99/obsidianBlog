---
title: SOLID - I 인터페이스 분리 원칙
description: 인터페이스 분리 원칙의 핵심과 비대한 인터페이스를 역할별로 분리해야 하는 이유를 실무 예시로 설명합니다.
tags:
  - 디자인패턴
  - SOLID
  - ISP
comments: true
---

## 1. 인터페이스 분리원칙
"클라이언트는 자신이 사용하지 않는 메서드에 의존하지 않아야 한다."
- 한 인터페이스가 너무 많은 기능을 제공하면 클라이언트(사용자) 입장에서 불필요한 기능에 의존할 가능성이 높아진다.
- 인터페이스를 작고 명확하게 나누어 특정 클라이언트에 필요한 기능만 제공해야 한다.
- 변경이 한 곳에서만 이루어지도록 하여 영향 범위를 최소화한다.

## 2. 예시
### 2-1 상황
쇼핑몰이나 전자 상거래 시스템에서 상품과 관련된 서비스를 개발한다고 가정한다.
관리자와 일반 사용자가 시스템에서 다른 역할과 기능을 수행한다.

### 2-2 요구사항
1. **관리자(Admin):** 상품을 추가, 수정, 삭제할 수 있다.
2. **일반 사용자(User):** 상품 목록을 조회하고 상세 정보를 확인할 수 있다.
3. 두 사용자 역할을 분리된 인터페이스로 구현하여 불필요한 메서드 의존성을 제거한다.

### 2-3 안좋은 예시
```java
public interface ProductService {
    void addProduct(String productName);
    void updateProduct(Long productId, String productName);
    void deleteProduct(Long productId);
    List<String> listProducts();
    String getProductDetail(Long productId);
}

```
#### 문제점
- 관리자와 일반 사용자가 동일한 인터페이스를 사용하기 때문에 필요 없는 메서드 구현 또는 사용이 발생한다.
- 일반 사용자는 `addProduct`, `updateProduct`, `deleteProduct` 메서드를 사용할 필요가 없지만, 인터페이스에 강제된다.

### 2-4 좋은 예시
#### (1) 역할에 따라 인터페이스 분리
```java
public interface ProductAdminService {
    void addProduct(String productName);
    void updateProduct(Long productId, String productName);
    void deleteProduct(Long productId);
}

public interface ProductUserService {
    List<String> listProducts();
    String getProductDetail(Long productId);
}

```

#### (2) 서비스 구현
```java
@Service
public class ProductAdminServiceImpl implements ProductAdminService {
    @Override
    public void addProduct(String productName) {
        System.out.println("상품 추가: " + productName);
    }

    @Override
    public void updateProduct(Long productId, String productName) {
        System.out.println("상품 수정 [ID: " + productId + "] -> " + productName);
    }

    @Override
    public void deleteProduct(Long productId) {
        System.out.println("상품 삭제 [ID: " + productId + "]");
    }
}

@Service
public class ProductUserServiceImpl implements ProductUserService {
    @Override
    public List<String> listProducts() {
        return List.of("상품1", "상품2", "상품3");
    }

    @Override
    public String getProductDetail(Long productId) {
        return "상품 상세 정보 [ID: " + productId + "]";
    }
}

```

#### (3) 컨트롤러 분리
```java
@RestController
@RequestMapping("/admin/products")
public class ProductAdminController {

    private final ProductAdminService productAdminService;

    public ProductAdminController(ProductAdminService productAdminService) {
        this.productAdminService = productAdminService;
    }

    @PostMapping
    public void addProduct(@RequestParam String productName) {
        productAdminService.addProduct(productName);
    }

    @PutMapping("/{productId}")
    public void updateProduct(@PathVariable Long productId, @RequestParam String productName) {
        productAdminService.updateProduct(productId, productName);
    }

    @DeleteMapping("/{productId}")
    public void deleteProduct(@PathVariable Long productId) {
        productAdminService.deleteProduct(productId);
    }
}

@RestController
@RequestMapping("/products")
public class ProductUserController {

    private final ProductUserService productUserService;

    public ProductUserController(ProductUserService productUserService) {
        this.productUserService = productUserService;
    }

    @GetMapping
    public List<String> listProducts() {
        return productUserService.listProducts();
    }

    @GetMapping("/{productId}")
    public String getProductDetail(@PathVariable Long productId) {
        return productUserService.getProductDetail(productId);
    }
}

```


## 3. ISP 적용의 장점
1. **명확한 역할 분리**:
    - 관리자와 사용자가 각기 다른 서비스 인터페이스에 의존.
    - 일반 사용자는 관리 기능에 전혀 의존하지 않음.
2. **유지보수성 향상**:
    - 변경이 필요한 인터페이스만 수정 가능.
    - 예를 들어, 관리 기능이 변경되어도 사용자 기능에는 영향이 없다.
3. **확장성 증가**:
    - 새로운 역할(예: 리뷰 기능)이 추가되더라도 기존 코드를 수정하지 않고 새로운 인터페이스와 구현체를 추가하면 된다.

## 4. 결론

Spring Boot에서 ISP를 적용하면 클라이언트가 자신이 사용하지 않는 메서드에 의존하지 않도록 설계할 수 있다. 이를 통해 명확한 역할 분리, 유지보수성 향상, 확장 가능성을 얻을 수 있으며, 대규모 프로젝트에서도 구조적인 복잡성을 효과적으로 관리할 수 있다.
