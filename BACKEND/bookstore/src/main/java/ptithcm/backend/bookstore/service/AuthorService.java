package ptithcm.backend.bookstore.service;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import ptithcm.backend.bookstore.dto.request.CreateAuthorRequest;
import ptithcm.backend.bookstore.dto.response.AuthorResponse;
import ptithcm.backend.bookstore.entity.Author;
import ptithcm.backend.bookstore.mapper.AuthorMapper;
import ptithcm.backend.bookstore.repository.AuthorRepository;

import java.util.ArrayList;
import java.util.List;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@Slf4j
public class AuthorService {
    AuthorRepository authorRepository;
    AuthorMapper authorMapper;
    public AuthorResponse create(CreateAuthorRequest createAuthorRequest) {
        log.info("Service: Creating author...");
        Author author = authorMapper.toEntity(createAuthorRequest);
        return authorMapper.toResponse(authorRepository.save(author));
    }

    public List<AuthorResponse> getAll(){
        List<AuthorResponse> authors = new ArrayList<>();
        for(Author author : authorRepository.findAll()){
            authors.add(authorMapper.toResponse(author));
        }
        return authors;
    }
}
