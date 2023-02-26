#!/bin/bash

# Set the input file name
input_file="uszip.json"

# Set the output directory name
output_dir="uszip-split"

# Set the number of zip codes per file
zip_codes_per_file=1000

# Create the output directory
mkdir -p "$output_dir"

# Get the total number of zip codes
total_zip_codes=$(jq length "$input_file")

# Iterate through the zip codes
for (( i=0; i<$total_zip_codes; i+=$zip_codes_per_file )); do
    # Get the current index and the end index
    current_index=$i
    end_index=$((i + zip_codes_per_file - 1))

    # Set the output file name
    output_file="${output_dir}/uszip_${current_index}-${end_index}.json"

    # Get the zip codes for the current file
    zip_codes=$(jq ".[$current_index:$end_index+1]" "$input_file")

    # Save the zip codes to the output file
    echo "$zip_codes" > "$output_file"
done