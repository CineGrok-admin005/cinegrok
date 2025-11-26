function onFormSubmit(e) {
    // Configuration
    // REPLACE WITH YOUR DEPLOYED NEXT.JS APP URL
    var API_URL = 'https://your-nextjs-app.vercel.app/api/v1/ingest';

    // Get the named values from the event object
    var namedValues = e.namedValues;

    // Construct the payload based on the specific columns provided
    // We map the spreadsheet columns to a clean JSON object
    var payload = {
        // Core Identity
        "timestamp": namedValues['Timestamp'] ? namedValues['Timestamp'][0] : "",
        "email": namedValues['Email address'] ? namedValues['Email address'][0] : "",
        "legal_name": namedValues['Full Name (Legal)'] ? namedValues['Full Name (Legal)'][0] : "",
        "name": namedValues['Stage / Screen Name'] && namedValues['Stage / Screen Name'][0] ? namedValues['Stage / Screen Name'][0] : (namedValues['Full Name (Legal)'] ? namedValues['Full Name (Legal)'][0] : "Anonymous"),
        "pronouns": namedValues['Pronouns'] ? namedValues['Pronouns'][0] : "",
        "dob": namedValues['Date of Birth'] ? namedValues['Date of Birth'][0] : "",

        // Location & Origin
        "country": namedValues['Country'] ? namedValues['Country'][0] : "",
        "native_location": namedValues['Native Location'] ? namedValues['Native Location'][0] : "",
        "current_location": namedValues['Current Location'] ? namedValues['Current Location'][0] : "",
        "nationality": namedValues['Nationality'] ? namedValues['Nationality'][0] : "",
        "languages": namedValues['Languages Known'] ? namedValues['Languages Known'][0] : "",

        // Links
        "profile_photo_url": namedValues['Profile Photo URL'] ? namedValues['Profile Photo URL'][0] : "",
        "instagram": namedValues['📸 Instagram Link'] ? namedValues['📸 Instagram Link'][0] : "",
        "youtube": namedValues['▶️ YouTube Link'] ? namedValues['▶️ YouTube Link'][0] : "",
        "imdb": namedValues['🎬 IMDb Link'] ? namedValues['🎬 IMDb Link'][0] : "",
        "linkedin": namedValues['💼 LinkedIn Link'] ? namedValues['💼 LinkedIn Link'][0] : "",
        "twitter": namedValues['🐦 Twitter / X Link'] ? namedValues['🐦 Twitter / X Link'][0] : "",
        "facebook": namedValues['📘 Facebook Link'] ? namedValues['📘 Facebook Link'][0] : "",
        "website": namedValues['🌍 Personal Website / Portfolio Link'] ? namedValues['🌍 Personal Website / Portfolio Link'][0] : "",
        "letterboxd": namedValues['🎞️ Letterboxd Profile Link'] ? namedValues['🎞️ Letterboxd Profile Link'][0] : "",
        "other_platforms": namedValues['✨ Other Platforms Link'] ? namedValues['✨ Other Platforms Link'][0] : "",

        // Education
        "schooling": namedValues['Schooling (10th Grade)'] ? namedValues['Schooling (10th Grade)'][0] : "",
        "higher_secondary": namedValues['Higher Secondary (12th Grade)'] ? namedValues['Higher Secondary (12th Grade)'][0] : "",
        "undergraduate": namedValues['Undergraduate (UG)'] ? namedValues['Undergraduate (UG)'][0] : "",
        "postgraduate": namedValues['Postgraduate (PG)'] ? namedValues['Postgraduate (PG)'][0] : "",
        "phd": namedValues['PhD (if applicable)'] ? namedValues['PhD (if applicable)'][0] : "",
        "certifications": namedValues['Certifications or Workshops'] ? namedValues['Certifications or Workshops'][0] : "",

        // Films (Looping structure flattened for JSON)
        "films": [],

        // Professional Details
        "roles": namedValues['Your Roles in Filmmaking'] ? namedValues['Your Roles in Filmmaking'][0] : "",
        "years_active": namedValues['Years Active in Film Industry'] ? namedValues['Years Active in Film Industry'][0] : "",
        "genres": namedValues['Preferred Genres or Themes'] ? namedValues['Preferred Genres or Themes'][0] : "",
        "style": namedValues['Visual / Narrative Style'] ? namedValues['Visual / Narrative Style'][0] : "",
        "influences": namedValues['Creative Influences (People)'] ? namedValues['Creative Influences (People)'][0] : "",
        "philosophy": namedValues['Creative Philosophy'] ? namedValues['Creative Philosophy'][0] : "",
        "belief": namedValues['Belief About Cinema'] ? namedValues['Belief About Cinema'][0] : "",
        "message": namedValues['Message or Intent'] ? namedValues['Message or Intent'][0] : "",
        "signature": namedValues['Creative Signature'] ? namedValues['Creative Signature'][0] : "",

        // Achievements & Press
        "awards": namedValues['Awards & Nominations'] ? namedValues['Awards & Nominations'][0] : "",
        "screenings": namedValues['Festival Screenings'] ? namedValues['Festival Screenings'][0] : "",
        "press": namedValues['Press / Media Coverage'] ? namedValues['Press / Media Coverage'][0] : "",

        // Collaboration
        "collaborations": namedValues['Collaborations & Mentorships'] ? namedValues['Collaborations & Mentorships'][0] : "",
        "open_to_collab": namedValues['Open to Collaborations?'] ? namedValues['Open to Collaborations?'][0] : "",
        "availability": namedValues['Availability'] ? namedValues['Availability'][0] : "",
        "representation": namedValues['Representation / Agency'] ? namedValues['Representation / Agency'][0] : "",
        "contact_method": namedValues['Preferred Contact Method'] ? namedValues['Preferred Contact Method'][0] : "",
        "phone": namedValues['Phone Number (Optional)'] ? namedValues['Phone Number (Optional)'][0] : "",
        "work_location": namedValues['Location for Work'] ? namedValues['Location for Work'][0] : "",

        // Meta
        "consent": namedValues['Consent Confirmation'] ? namedValues['Consent Confirmation'][0] : "",
        "notes": namedValues['Special Notes or Requests'] ? namedValues['Special Notes or Requests'][0] : ""
    };

    // Helper to add films
    for (var i = 1; i <= 10; i++) {
        var titleKey = 'Film ' + i + ' Title';
        if (namedValues[titleKey] && namedValues[titleKey][0]) {
            payload.films.push({
                "title": namedValues['Film ' + i + ' Title'][0],
                "year": namedValues['Film ' + i + ' Year'] ? namedValues['Film ' + i + ' Year'][0] : "",
                "genre": namedValues['Film ' + i + ' Genre'] ? namedValues['Film ' + i + ' Genre'][0] : "",
                "duration": namedValues['Film ' + i + ' Duration'] ? namedValues['Film ' + i + ' Duration'][0] : "",
                "role": namedValues['Your Role(s) in Film ' + i] ? namedValues['Your Role(s) in Film ' + i][0] : "",
                "synopsis": namedValues['Film ' + i + ' Synopsis'] ? namedValues['Film ' + i + ' Synopsis'][0] : "",
                "link": namedValues['Film ' + i + ' Link'] ? namedValues['Film ' + i + ' Link'][0] : "",
                "poster": namedValues['Film ' + i + ' Poster URL'] ? namedValues['Film ' + i + ' Poster URL'][0] : ""
            });
        }
    }

    // Send to API
    var options = {
        'method': 'post',
        'contentType': 'application/json',
        'payload': JSON.stringify(payload)
    };

    try {
        UrlFetchApp.fetch(API_URL, options);
    } catch (e) {
        Logger.log("Error sending data: " + e);
    }
}

/**
 * Run this function ONCE manually to process rows that are already in the sheet.
 */
function processExistingRows() {
    // OPTIONAL: If you get an error saying "Cannot read properties of null", 
    // paste your Spreadsheet ID here. It is the long string in your Google Sheet URL.
    // Example: https://docs.google.com/spreadsheets/d/1aBcD.../edit -> ID is "1aBcD..."
    var SPREADSHEET_ID = "";

    var sheet;
    try {
        sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    } catch (e) {
        if (SPREADSHEET_ID) {
            sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheets()[0];
        } else {
            Logger.log("ERROR: Could not find the spreadsheet. Please fill in the SPREADSHEET_ID variable in the script.");
            return;
        }
    }

    var data = sheet.getDataRange().getValues();
    var headers = data[0];

    // Start from row 1 (skipping header row 0)
    for (var i = 1; i < data.length; i++) {
        var row = data[i];
        var e = { namedValues: {} };

        // Reconstruct the event object structure
        for (var j = 0; j < headers.length; j++) {
            e.namedValues[headers[j]] = [row[j]];
        }

        Logger.log("Processing row " + (i + 1) + "...");
        onFormSubmit(e);
        // Wait a bit to not overwhelm the API
        Utilities.sleep(1000);
    }
    Logger.log("Done processing existing rows.");
}
