#!/bin/bash

# Set the input file name
input_file="uszip.json"

# Set the full state name lookup file name
state_lookup_file="us_state_lookup.json"

#get total index of state_lookup_file
total_state=$(cat $state_lookup_file | jq '. | length')

# Iterate through the state
for (( i=0; i<$total_state; i++ )); do
    # Get the current index and the end index
    current_index=$i

    # Get the state abbreviation
    statecode=$(cat $state_lookup_file | jq ".[$current_index].abbreviation")
    fullstate=$(cat $state_lookup_file | jq ".[$current_index].name")
    #replace any line that contain "state": "$statecode" with "state": "$statecode", \n    "full_state": "$fullstate" in $input_file
    sed -i "s/\"state\": $statecode/\"state\": $statecode,\n    \"full_state\": $fullstate/g" $input_file
    echo "tambah $statecode dengan $fullstate"
done

    