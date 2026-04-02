//package ptithcm.backend.bookstore.service;
//
//import lombok.AccessLevel;
//import lombok.RequiredArgsConstructor;
//import lombok.experimental.FieldDefaults;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.stereotype.Service;
//import ptithcm.backend.bookstore.dto.request.CreateSupplierRequest;
//import ptithcm.backend.bookstore.dto.response.SupplierResponse;
//import ptithcm.backend.bookstore.mapper.SupplierMapper;
//import ptithcm.backend.bookstore.repository.SupplierRepository;
//
//import java.util.ArrayList;
//import java.util.List;
//
//@Service
//@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
//@RequiredArgsConstructor
//@Slf4j
//public class SupplierService {
//    SupplierRepository supplierRepository;
//    SupplierMapper supplierMapper;
//
//    public SupplierResponse create(CreateSupplierRequest createSupplierRequest){
//        Supplier supplier = supplierMapper.toEntity(createSupplierRequest);
//        return supplierMapper.toResponse(supplierRepository.save(supplier));
//    }
//
//    public List<SupplierResponse> getAll(){
//        List<SupplierResponse> suppliers = new ArrayList<>();
//        for(Supplier supplier : supplierRepository.findAll()){
//            suppliers.add(supplierMapper.toResponse(supplier));
//        }
//        return suppliers;
//    }
//}
