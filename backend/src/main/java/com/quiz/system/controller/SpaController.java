package com.quiz.system.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SpaController {

    // Forward non-API, non-asset paths to index.html for React SPA client-side routing
    @GetMapping(value = {
        "/",
        "/{path:^(?!api|h2-console|assets|favicon\\.svg|icons\\.svg)[^\\.]*}/**"
    })
    public String forward() {
        return "forward:/index.html";
    }
}
