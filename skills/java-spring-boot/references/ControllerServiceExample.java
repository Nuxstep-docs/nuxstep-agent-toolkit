package com.nuxstep.example;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final CreateUserUseCase createUserUseCase;

    public UserController(CreateUserUseCase createUserUseCase) {
        this.createUserUseCase = createUserUseCase; // Injeção limpa, sem Autowired
    }

    @PostMapping
    public ResponseEntity<UserResponseDTO> create(@Valid @RequestBody CreateUserRequestDTO request) {
        UserEntity user = createUserUseCase.execute(request.email(), request.name());
        return ResponseEntity.ok(UserResponseDTO.fromEntity(user));
    }
}
