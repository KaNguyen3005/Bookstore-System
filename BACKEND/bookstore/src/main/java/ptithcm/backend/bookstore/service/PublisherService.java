package ptithcm.backend.bookstore.service;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import ptithcm.backend.bookstore.dto.request.CreatePublisherRequest;
import ptithcm.backend.bookstore.dto.request.CreateSupplierRequest;
import ptithcm.backend.bookstore.dto.response.PublisherResponse;
import ptithcm.backend.bookstore.dto.response.SupplierResponse;
import ptithcm.backend.bookstore.entity.Publisher;
import ptithcm.backend.bookstore.entity.Supplier;
import ptithcm.backend.bookstore.mapper.PublisherMapper;
import ptithcm.backend.bookstore.mapper.SupplierMapper;
import ptithcm.backend.bookstore.repository.PublisherRepository;
import ptithcm.backend.bookstore.repository.SupplierRepository;

import java.util.ArrayList;
import java.util.List;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@Slf4j
public class PublisherService {
    PublisherRepository publisherRepository;
    PublisherMapper publisherMapper;

    public PublisherResponse create(CreatePublisherRequest createPublisherRequest){
        Publisher publisher = publisherMapper.toEntity(createPublisherRequest);
        return publisherMapper.toResponse(publisherRepository.save(publisher));
    }

    public List<PublisherResponse> getAll(){
        List<PublisherResponse> publishers = new ArrayList<>();
        for(Publisher publisher : publisherRepository.findAll()){
            publishers.add(publisherMapper.toResponse(publisher));
        }
        return publishers;
    }
}
