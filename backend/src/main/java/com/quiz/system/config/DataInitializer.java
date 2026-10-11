package com.quiz.system.config;

import com.quiz.system.entity.*;
import com.quiz.system.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private QuizRepository quizRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private QuizAttemptRepository quizAttemptRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        if (userRepository.count() > 0) {
            return; // Data already initialized
        }

        System.out.println(">>> Initializing Online Quiz System sample database...");

        // 1. Create Default Users
        User admin = new User("System Administrator", "admin@quiz.com", passwordEncoder.encode("admin123"), "ROLE_ADMIN");
        User student = new User("John Doe", "user@quiz.com", passwordEncoder.encode("user123"), "ROLE_USER");
        User student2 = new User("Sarah Connor", "sarah@quiz.com", passwordEncoder.encode("sarah123"), "ROLE_USER");
        User student3 = new User("Alex Mercer", "alex@quiz.com", passwordEncoder.encode("alex123"), "ROLE_USER");

        userRepository.saveAll(List.of(admin, student, student2, student3));

        // 2. Create Categories
        Category catJava = new Category("Java Programming", "Core Java syntax, OOP principles, JVM architecture, and Spring framework.", "Coffee", "#6366f1");
        Category catWeb = new Category("Web Development", "HTML5, CSS3, modern JavaScript ES6+, and React ecosystem.", "Globe", "#0ea5e9");
        Category catDb = new Category("Database & SQL", "Relational databases, SQL queries, indexing, normalization, and ACID properties.", "Database", "#f59e0b");
        Category catDsa = new Category("Data Structures & Algorithms", "Arrays, Trees, Graphs, Sorting algorithms, and Big-O computational complexity.", "Cpu", "#8b5cf6");

        categoryRepository.saveAll(List.of(catJava, catWeb, catDb, catDsa));

        // 3. Create Quizzes & Questions

        // Quiz 1: Core Java Fundamentals
        Quiz javaQuiz = new Quiz("Java & OOP Mastery", "Test your knowledge of Core Java, OOP concepts, exceptions, and memory management.", catJava, 10, 60, "MEDIUM");
        quizRepository.save(javaQuiz);

        Question qj1 = new Question(javaQuiz,
                "Which concept of Object-Oriented Programming enables a subclass to provide a specific implementation of a method that is already provided by its superclass?",
                "Method Overloading",
                "Method Overriding",
                "Encapsulation",
                "Abstraction",
                "B",
                "Method Overriding allows a subclass to provide a specific implementation of a method defined in its superclass using the same signature.",
                2);

        Question qj2 = new Question(javaQuiz,
                "In Java, where are objects dynamically allocated at runtime?",
                "Stack Memory",
                "Heap Memory",
                "PermGen / Metaspace only",
                "Register Memory",
                "B",
                "All Java objects are allocated on the Heap memory, managed by the Garbage Collector.",
                2);

        Question qj3 = new Question(javaQuiz,
                "Which interface is the root of the Java Collections Framework (excluding Map)?",
                "java.util.List",
                "java.util.Collection",
                "java.util.Iterable",
                "java.util.Queue",
                "B",
                "The Collection interface is the root interface in the collection hierarchy.",
                2);

        Question qj4 = new Question(javaQuiz,
                "What is the default value of a boolean variable declared as a class field in Java?",
                "true",
                "false",
                "null",
                "undefined",
                "B",
                "Default value for instance/static boolean primitives is 'false'.",
                1);

        Question qj5 = new Question(javaQuiz,
                "Which keyword prevents a class from being inherited in Java?",
                "static",
                "abstract",
                "final",
                "sealed",
                "C",
                "The 'final' keyword on a class prevents it from being extended/subclassed.",
                1);

        questionRepository.saveAll(List.of(qj1, qj2, qj3, qj4, qj5));

        // Quiz 2: React & Modern Web
        Quiz webQuiz = new Quiz("React & Modern JavaScript", "Evaluate your skills in React Hooks, virtual DOM, JSX, and ES6 modern JavaScript.", catWeb, 12, 70, "EASY");
        quizRepository.save(webQuiz);

        Question qw1 = new Question(webQuiz,
                "Which React hook is used to execute side effects like data fetching or DOM subscriptions?",
                "useState",
                "useEffect",
                "useContext",
                "useReducer",
                "B",
                "useEffect lets you synchronize a component with an external system such as APIs or timers.",
                2);

        Question qw2 = new Question(webQuiz,
                "What does the Virtual DOM in React primarily provide?",
                "Direct low-level hardware acceleration",
                "An in-memory representation of real DOM to batch and optimize updates",
                "A built-in relational SQL database for the client",
                "A server-side routing protocol",
                "B",
                "Virtual DOM reconciles changes in memory before making minimal batch mutations to the actual browser DOM.",
                2);

        Question qw3 = new Question(webQuiz,
                "In JavaScript ES6, what is the key difference between 'const' and 'let'?",
                "'const' variables have global scope, 'let' variables have function scope",
                "'const' identifiers cannot be reassigned after declaration",
                "'let' variables cannot be mutated",
                "'const' is only supported in NodeJS",
                "B",
                "'const' declares block-scoped variables that cannot be reassigned.",
                2);

        Question qw4 = new Question(webQuiz,
                "How are props passed from a parent component to a child component in JSX?",
                "Through HTML-like attributes: <Child title='Hello' />",
                "Via window.localStorage",
                "By using the @Prop decorator",
                "Through global CSS classes",
                "A",
                "Props are passed into JSX elements similarly to HTML attributes.",
                1);

        questionRepository.saveAll(List.of(qw1, qw2, qw3, qw4));

        // Quiz 3: Database & SQL
        Quiz dbQuiz = new Quiz("SQL & Database Normalization", "Essential knowledge of SQL queries, JOINs, ACID transactions, and normalization forms.", catDb, 15, 60, "HARD");
        quizRepository.save(dbQuiz);

        Question qd1 = new Question(dbQuiz,
                "Which SQL clause is used to filter group results after an aggregate function (e.g., COUNT, AVG)?",
                "WHERE",
                "HAVING",
                "ORDER BY",
                "GROUP BY",
                "B",
                "HAVING is used to filter records after aggregate groupings, whereas WHERE filters individual rows before grouping.",
                2);

        Question qd2 = new Question(dbQuiz,
                "What does the 'A' in the ACID transaction properties stand for?",
                "Availability",
                "Atomicity",
                "Authentication",
                "Authorization",
                "B",
                "Atomicity guarantees that all operations within a transaction are completed; otherwise, the transaction is completely aborted and rolled back.",
                2);

        Question qd3 = new Question(dbQuiz,
                "What type of JOIN returns all records from the left table and matched records from the right table?",
                "INNER JOIN",
                "LEFT OUTER JOIN",
                "CROSS JOIN",
                "FULL JOIN",
                "B",
                "LEFT JOIN (or LEFT OUTER JOIN) returns all records from the left table and matched rows from the right table (with NULLs for unmatched).",
                2);

        Question qd4 = new Question(dbQuiz,
                "Which normal form eliminates partial functional dependency on a composite primary key?",
                "1NF (First Normal Form)",
                "2NF (Second Normal Form)",
                "3NF (Third Normal Form)",
                "BCNF (Boyce-Codd Normal Form)",
                "B",
                "2NF requires that the table is in 1NF and no non-prime attribute is dependent on any proper subset of any candidate key.",
                2);

        questionRepository.saveAll(List.of(qd1, qd2, qd3, qd4));

        // Quiz 4: Data Structures & Algorithms
        Quiz dsaQuiz = new Quiz("Data Structures & Algorithms Basics", "Analyze time complexity, search & sort mechanics, and stack/queue usage.", catDsa, 10, 60, "MEDIUM");
        quizRepository.save(dsaQuiz);

        Question qa1 = new Question(dsaQuiz,
                "What is the average time complexity of Binary Search on a sorted array of size N?",
                "O(1)",
                "O(N)",
                "O(log N)",
                "O(N log N)",
                "C",
                "Binary search repeatedly divides the search interval in half, resulting in O(log N) time complexity.",
                2);

        Question qa2 = new Question(dsaQuiz,
                "Which data structure follows the Last-In-First-Out (LIFO) order?",
                "Queue",
                "Stack",
                "Linked List",
                "Binary Tree",
                "B",
                "A Stack follows the Last In First Out (LIFO) access order.",
                2);

        Question qa3 = new Question(dsaQuiz,
                "What is the worst-case time complexity of QuickSort?",
                "O(N)",
                "O(N log N)",
                "O(N^2)",
                "O(log N)",
                "C",
                "QuickSort degrades to O(N^2) if the pivot choices consistently partition the elements into maximally unbalanced sub-arrays.",
                2);

        questionRepository.saveAll(List.of(qa1, qa2, qa3));

        // 4. Create Initial Sample Quiz Attempts for Realistic Leaderboard & Dashboard
        QuizAttempt sampleAttempt1 = new QuizAttempt();
        sampleAttempt1.setUser(student);
        sampleAttempt1.setQuiz(javaQuiz);
        sampleAttempt1.setTotalScore(8);
        sampleAttempt1.setMaxScore(8);
        sampleAttempt1.setPercentage(100.0);
        sampleAttempt1.setPassed(true);
        sampleAttempt1.setTotalQuestions(5);
        sampleAttempt1.setCorrectCount(5);
        sampleAttempt1.setIncorrectCount(0);
        sampleAttempt1.setSkippedCount(0);
        sampleAttempt1.setTimeTakenSeconds(185);
        sampleAttempt1.setStartedAt(LocalDateTime.now().minusHours(5));
        sampleAttempt1.setCompletedAt(LocalDateTime.now().minusHours(5).plusSeconds(185));

        QuizAttempt sampleAttempt2 = new QuizAttempt();
        sampleAttempt2.setUser(student2);
        sampleAttempt2.setQuiz(webQuiz);
        sampleAttempt2.setTotalScore(5);
        sampleAttempt2.setMaxScore(7);
        sampleAttempt2.setPercentage(71.4);
        sampleAttempt2.setPassed(true);
        sampleAttempt2.setTotalQuestions(4);
        sampleAttempt2.setCorrectCount(3);
        sampleAttempt2.setIncorrectCount(1);
        sampleAttempt2.setSkippedCount(0);
        sampleAttempt2.setTimeTakenSeconds(240);
        sampleAttempt2.setStartedAt(LocalDateTime.now().minusDays(1));
        sampleAttempt2.setCompletedAt(LocalDateTime.now().minusDays(1).plusSeconds(240));

        QuizAttempt sampleAttempt3 = new QuizAttempt();
        sampleAttempt3.setUser(student3);
        sampleAttempt3.setQuiz(dbQuiz);
        sampleAttempt3.setTotalScore(8);
        sampleAttempt3.setMaxScore(8);
        sampleAttempt3.setPercentage(100.0);
        sampleAttempt3.setPassed(true);
        sampleAttempt3.setTotalQuestions(4);
        sampleAttempt3.setCorrectCount(4);
        sampleAttempt3.setIncorrectCount(0);
        sampleAttempt3.setSkippedCount(0);
        sampleAttempt3.setTimeTakenSeconds(210);
        sampleAttempt3.setStartedAt(LocalDateTime.now().minusHours(2));
        sampleAttempt3.setCompletedAt(LocalDateTime.now().minusHours(2).plusSeconds(210));

        quizAttemptRepository.saveAll(List.of(sampleAttempt1, sampleAttempt2, sampleAttempt3));

        System.out.println(">>> Database initialized successfully with sample users, quizzes, questions, and attempts!");
        System.out.println(">>> Admin: admin@quiz.com / admin123");
        System.out.println(">>> User: user@quiz.com / user123");
    }
}
