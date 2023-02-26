#!/bin/bash

# Set the input directory name
file="uszip.json"

# Set the full state name lookup file name
state_lookup_file="us_state_lookup.json"

# Get the total number of zip codes
total=$(cat $file | jq '. | length')
#set file content to a variable
file_content=$(cat $file)
newfile="uszip-fullstate.json"
# Iterate through the zip codes
for (( i=0; i<$total; i++ )); do
    # Get the current index and the end index
    current_index=$i

    # Get the state abbreviation
    state=$(echo $file_content | jq ".[$current_index].state")
    echo -n "proses $i dari $total"
    # Get the full state name
    full_state=$(cat $state_lookup_file | jq ".[] | select(.abbreviation == $state) | .name")
    #add full_state object with value $full_state to the json object infile at index $current_index
    file_content=$(jq --argjson full_state "$full_state" ".[$current_index] += {full_state: \$full_state}" <<< "$file_content")
done

# Save the zip codes to the output file
echo "$file_content" > "$newfile"