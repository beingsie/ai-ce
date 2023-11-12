import os
import re
import markdown


def generate_output_filename(input_md_file, output_directory):
    base_name, ext = os.path.splitext(input_md_file)
    pattern = re.compile(r"converted_site_(\d+)\.html")

    # Find existing converted_site files
    existing_files = [f for f in os.listdir(output_directory) if pattern.match(f)]

    # Determine the next available number
    if existing_files:
        existing_numbers = [int(pattern.match(f).group(1)) for f in existing_files]
        next_number = max(existing_numbers) + 1
    else:
        next_number = 0

    output_file = f"converted_site_{next_number:02d}.html"
    return os.path.join(output_directory, output_file), output_file


def convert_md_to_html(input_md_file, output_html_file, output_directory):
    with open(input_md_file, "r", encoding="utf-8") as md_file:
        md_content = md_file.read()

        # Convert Markdown to HTML
        html_content = markdown.markdown(md_content)

    # Create the output directory specified in the argument
    os.makedirs(os.path.join(output_directory, output_html_file), exist_ok=True)

    with open(
        os.path.join(output_directory, output_html_file, "index.html"),
        "w",
        encoding="utf-8",
    ) as html_file:
        # Write the HTML content to the output file with HTML5 structure
        html_file.write(
            f"""
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Converted HTML</title>
</head>
<body>

{html_content}

</body>
</html>
"""
        )

    return os.path.join(
        output_directory, output_html_file
    )  # Return the directory where the HTML file is saved


if __name__ == "__main__":
    # Replace 'input.md' with your file name
    input_file = "input.md"

    # Generate the output HTML filename and output directory
    output_file, output_filename = generate_output_filename(input_file, os.getcwd())

    # Convert Markdown to HTML
    output_directory = convert_md_to_html(input_file, output_file, os.getcwd())

    print(
        f"Success! Output HTML file: {output_filename} in directory: {os.path.basename(output_directory)}"
    )