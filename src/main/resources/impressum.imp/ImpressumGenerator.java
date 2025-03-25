package de.monticore.impressum;

import de.monticore.impressum._parser.ImpressumParser;
import de.monticore.impressum._ast.ASTImpressum;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;

public class ImpressumGenerator {

    public static void main(String[] args) {
        // Path to the Impressum file
        String inputFilePath = "src/main/resources/impressum.imp";
        String outputFilePath = "output/impressum.php";

        ImpressumParser parser = new ImpressumParser();

        try {
            // Parse the Impressum file
            ASTImpressum ast = parser.parse(new File(inputFilePath)).orElseThrow(() -> new RuntimeException("Parsing failed!"));

            // Generate the Impressum PHP content
            String phpContent = generatePHP(ast);

            // Write the PHP content to a file
            FileWriter writer = new FileWriter(outputFilePath);
            writer.write(phpContent);
            writer.close();

            System.out.println("Impressum page generated at: " + outputFilePath);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private static String generatePHP(ASTImpressum ast) {
        StringBuilder php = new StringBuilder();
        php.append("<?php\n");
        php.append("echo \"<!DOCTYPE html>\\n<html>\\n<head>\\n<title>Impressum</title>\\n</head>\\n<body>\\n\";\n");
        php.append("echo \"<h1>Impressum</h1>\\n\";\n");

        ast.getSectionsList().forEach(section -> {
            php.append("echo \"<h2>").append(section.getTitle()).append("</h2>\\n\";\n");
            php.append("echo \"<p>").append(section.getContent()).append("</p>\\n\";\n");
        });

        php.append("echo \"</body>\\n</html>\";\n");
        php.append("?>");
        return php.toString();
    }
}