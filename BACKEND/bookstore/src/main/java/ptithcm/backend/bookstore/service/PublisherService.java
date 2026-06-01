package ptithcm.backend.bookstore.service;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import ptithcm.backend.bookstore.dto.request.CreatePublisherRequest;
import ptithcm.backend.bookstore.dto.request.UpdatePublisherRequest;
import ptithcm.backend.bookstore.dto.response.PublisherResponse;
import ptithcm.backend.bookstore.entity.Author;
import ptithcm.backend.bookstore.entity.Publisher;
import ptithcm.backend.bookstore.exception.AppException;
import ptithcm.backend.bookstore.exception.ErrorCode;
import ptithcm.backend.bookstore.mapper.PublisherMapper;
import ptithcm.backend.bookstore.repository.PublisherRepository;

import java.util.ArrayList;
import java.util.List;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@Slf4j
public class PublisherService {
    PublisherRepository publisherRepository;
    PublisherMapper publisherMapper;

    public PublisherResponse create(CreatePublisherRequest request){
        Publisher publisher = publisherMapper.toEntity(request);
        return publisherMapper.toResponse(publisherRepository.save(publisher));
    }

    public List<PublisherResponse> getAll(){
        List<PublisherResponse> publishers = new ArrayList<>();
        for(Publisher publisher : publisherRepository.findAll()){
            publishers.add(publisherMapper.toResponse(publisher));
        }
        return publishers;
    }

    public PublisherResponse update(Integer id, UpdatePublisherRequest request){
        Publisher publisher = publisherRepository.findById(id)
            .orElseThrow(() -> new AppException(ErrorCode.PUBLISHER_NOT_FOUND));

        if(request.getPublisherName() != null){
            publisher.setPublisherName(request.getPublisherName());
        }

        return publisherMapper.toResponse(publisherRepository.save(publisher));
    }

    public void delete(Integer id){
        Publisher publisher  = publisherRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.AUTHOR_NOT_FOUND));
        publisherRepository.delete(publisher);
    }

}
