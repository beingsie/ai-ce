# Markdown to HTML Converter

This Python script converts Markdown files to HTML. It utilizes the `markdown` library to convert the content and generates an HTML file with a basic HTML5 structure.

## Usage

1. Make sure you have Python installed on your system.

2. Create a virtual environment to manage dependencies. Open a terminal and navigate to the project directory:

- Create a virtual environment
    ```bash
    python -m venv venv
    ```
- Activate the virtual environment
    ```bash

    ## On Windows
    .\venv\Scripts\activate

    ## On Unix or MacOS
    source venv/bin/activate
    ```

3. Install the required dependencies:

    ```bash
    pip install -r requirements.txt
    ```

4. Replace the placeholder `input.md` with your Markdown content:

    - **Option 1:** Replace the entire content of the `input.md` file with your own Markdown content.
    
    - **Option 2:** Copy and paste your existing Markdown content into the `input.md` file.

    ```python
    # Replace 'input.md' with your file name
    input_file = "input.md"
    ```

    Ensure that the `input.md` file is in the same directory as the script.

5. Run the script:

    ```bash
    python script_name.py
    ```

   The converted HTML file will be saved in the same directory as the input Markdown file.

## File Naming Convention

The script follows a naming convention for the output HTML files. It checks for existing files and determines the next available number to avoid overwriting existing files. The generated HTML file is named as `converted_site_xx/index.html`, where `xx` is a two-digit number.

## Output

Upon successful conversion, the script will print a success message with details about the output HTML file and directory.

Example:

```bash
Success! Output HTML file: converted_site_00.html in directory: converted_site_00
```

## Dependencies

- [Markdown](https://pypi.org/project/Markdown/): A Python implementation of Markdown.