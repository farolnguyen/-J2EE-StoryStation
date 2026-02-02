package fit.hutech.spring.controllers;

import fit.hutech.spring.entities.Book;
import fit.hutech.spring.services.BookService;
import fit.hutech.spring.services.CategoryService;
import fit.hutech.spring.viewmodels.BookGetVm;
import fit.hutech.spring.viewmodels.BookPostVm;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@CrossOrigin(origins = "**")
@RequiredArgsConstructor
public class ApiController {
    private final BookService bookService;
    private final CategoryService categoryService;

    @GetMapping("/books")
    public ResponseEntity<List<BookGetVm>> getAllBooks(
            @RequestParam(defaultValue = "0") Integer pageNo,
            @RequestParam(defaultValue = "20") Integer pageSize,
            @RequestParam(defaultValue = "id") String sortBy) {
        return ResponseEntity.ok(bookService.getAllBooks(
                pageNo == null ? 0 : pageNo,
                pageSize == null ? 20 : pageSize,
                sortBy == null ? "id" : sortBy)
                .stream()
                .map(BookGetVm::from)
                .toList());
    }

    @GetMapping("/books/{id}")
    public ResponseEntity<BookGetVm> getBookById(@PathVariable @NotNull Long id) {
        return ResponseEntity.ok(bookService.getBookById(id)
                .map(BookGetVm::from)
                .orElse(null));
    }

    @DeleteMapping("/books/{id}")
    public ResponseEntity<Void> deleteBookById(@PathVariable @NotNull Long id) {
        bookService.deleteBookById(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/books/search")
    public ResponseEntity<List<BookGetVm>> searchBooks(@RequestParam String keyword) {
        return ResponseEntity.ok(bookService.searchBook(keyword)
                .stream()
                .map(BookGetVm::from)
                .toList());
    }

    @PostMapping("/books")
    public ResponseEntity<BookGetVm> createBook(@RequestBody @Valid BookPostVm bookPostVm) {
        Book book = new Book();
        book.setTitle(bookPostVm.title());
        book.setAuthor(bookPostVm.author());
        book.setPrice(bookPostVm.price());
        book.setCategory(categoryService.getCategoryById(bookPostVm.categoryId())
                .orElseThrow(() -> new IllegalArgumentException("Category not found")));
        
        bookService.addBook(book);
        return ResponseEntity.status(HttpStatus.CREATED).body(BookGetVm.from(book));
    }

    @PutMapping("/books/{id}")
    public ResponseEntity<BookGetVm> updateBook(
            @PathVariable @NotNull Long id,
            @RequestBody @Valid BookPostVm bookPostVm) {
        Book book = bookService.getBookById(id)
                .orElseThrow(() -> new IllegalArgumentException("Book not found"));
        
        book.setTitle(bookPostVm.title());
        book.setAuthor(bookPostVm.author());
        book.setPrice(bookPostVm.price());
        book.setCategory(categoryService.getCategoryById(bookPostVm.categoryId())
                .orElseThrow(() -> new IllegalArgumentException("Category not found")));
        
        bookService.updateBook(book);
        return ResponseEntity.ok(BookGetVm.from(book));
    }

    @GetMapping("/categories")
    public ResponseEntity<List<CategoryDto>> getAllCategories() {
        return ResponseEntity.ok(categoryService.getAllCategories()
                .stream()
                .map(category -> new CategoryDto(category.getId(), category.getName()))
                .toList());
    }

    private record CategoryDto(Long id, String name) {}
}
