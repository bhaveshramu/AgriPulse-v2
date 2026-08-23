# AgriPulse Foundation

AgriPulse - Part 1: Professional Web Application Foundation

Build the first development version of a production-quality web application called AgriPulse.

AgriPulse is an AI-powered agricultural advisory platform designed primarily for Indian farmers. The final system will eventually consist of:

Primary: Web application

Secondary: Android application

Tertiary: WhatsApp AI bot

This prompt is ONLY for Part 1 of the project. Do not attempt to implement every future AI/API integration yet.

The architecture must be clean, modular, scalable and easy to continue developing later in a desktop IDE using GitHub and Codex.

1. PROJECT PURPOSE

AgriPulse helps farmers access agricultural information and services through one simple platform.

The final system will contain:

Farmer account and farm management

Crop disease detection

Mandi/market price intelligence

Weather and agricultural advisory

Farm equipment rental marketplace

Multilingual interface

Voice-first Android experience

Loan eligibility advisory

WhatsApp-based crop disease diagnosis

Admin analytics

The application should be designed specifically for farmers and should prioritize:

Simplicity

Readability

Accessibility

Mobile-first usability

Low digital literacy

Clear navigation

Low cognitive load

Professional appearance

2. IMPORTANT DESIGN DIRECTION

Do NOT make this application look like a generic AI SaaS dashboard.

Avoid:

Neon colors

Excessive gradients

Glowing borders

Futuristic cyberpunk styling

Robot illustrations

Excessive glassmorphism

AI brain graphics

Unnecessary animated backgrounds

Overly complicated dashboards

Excessive tiny cards

Decorative elements that reduce usability

The application should look like a serious, trustworthy agricultural technology platform.

The visual language should be:

Professional

Clean

Calm

Agricultural

Modern

Friendly

Practical

Government/project-grade

Suitable for Indian farmers

Use a restrained agricultural visual identity based around natural greens, neutral backgrounds and strong readable typography.

Use green as the primary brand color, but do not make every component green.

Use white/light neutral surfaces, subtle borders, clear hierarchy and sufficient spacing.

The interface should feel trustworthy rather than flashy.

3. TECHNOLOGY FOUNDATION

Use a modern React-based web architecture.

Preferred stack:

React

TypeScript

Tailwind CSS

Component-based architecture

Chart.js or a compatible chart library for future analytics

Supabase/PostgreSQL as the primary database foundation

The architecture must allow future integration with:

Python FastAPI

YOLOv8

Scikit-learn/TensorFlow

Weather APIs

Market APIs

Bhashini

DigiLocker

Razorpay

Meta WhatsApp Cloud API

Android application backend

Do not hard-code external API secrets into the frontend.

Use environment variables for future API integrations.

Create clear service/API abstraction layers so future backend integrations can be added without rewriting the UI.

4. COST REQUIREMENT

This is a final-year academic project and the development target is ₹0.

Do not introduce paid third-party services unnecessarily.

Use free/open-source technologies wherever possible.

Do not require paid APIs for the current Part 1 implementation.

For integrations that will require credentials later, create clean placeholders/interfaces instead of fake production integrations.

Do not expose API keys in client-side code.

5. APPLICATION STRUCTURE

Create the following primary routes/pages.

Public:

/

/login

/register

Farmer application:

/dashboard

/profile

/farm

/disease-detection

/market

/weather

/equipment

/loan-advisor

/advisory

/settings

Admin:

/admin

/admin/users

/admin/disease

/admin/equipment

/admin/market

/admin/reports

/admin/settings

The pages that depend on future APIs should currently use clearly structured demo/mock data.

The UI must be designed so the mock data can later be replaced by real API responses without redesigning the page.

6. LANDING PAGE

Create a professional landing page for AgriPulse.

Header:

AgriPulse logo/text

Home

Features

How It Works

About

Login

Get Started

Hero section:

Title:

"Smart Farming. Better Decisions."

Subtitle:

"AI-powered agricultural guidance designed for Indian farmers."

Primary CTA:

"Get Started"

Secondary CTA:

"Explore Features"

Include a professional agricultural visual or illustration, but avoid generic AI robot imagery.

Feature overview:

Crop Disease Detection

Market Price Intelligence

Weather & Advisory

Equipment Rental

Farmer Support

Include a short "How AgriPulse Helps Farmers" section.

Include a simple footer.

The landing page must look like a serious product/project website, not a template.

7. AUTHENTICATION FOUNDATION

Create farmer registration and login interfaces.

Registration fields:

Full Name

Mobile Number

Email (optional)

State

District

Preferred Language

Password

Confirm Password

Do NOT implement real Aadhaar authentication yet.

Instead, create a clean authentication abstraction that can later support:

Aadhaar OTP

JWT

DigiLocker

For the current version, use normal development authentication.

Authentication must be structured so real authentication can replace the development method later.

8. USER ROLES

Support these roles in the architecture:

Farmer

Agriculture Officer

FPO

Admin

For the initial application, the primary active user should be the Farmer.

Each farmer should manage their own:

Profile

Farm

Crops

Disease scans

Market preferences

Equipment activity

Weather location

Advisory information

Do not expose another farmer's private information.

Create role-based routing/authorization architecture for future expansion.

9. FARMER DASHBOARD

The farmer dashboard should be the main home screen after login.

At the top:

Welcome message

Farmer name

Current location

Language selector

Profile icon

Dashboard sections:

Weather Summary

Show:

Current temperature

Weather condition

Humidity

Rain probability

Location

Simple 5-day forecast preview

Use mock data for now.

Add:

"View Weather Advisory"

Crop Health

Show the farmer's currently registered crops.

Example:

Tomato

Potato

Display:

Crop name

Growth stage

Health status

Last disease scan

Quick action

Add:

"Scan Crop"

Market Snapshot

Show a simple market card:

Selected crop

Current indicative price

Market/location

Trend indicator

Use mock data.

Add:

"View Market Prices"

Quick Actions

Create clear farmer-friendly actions:

Scan Crop

Check Market Price

Weather

Rent Equipment

Farm Advisory

Advisory

Show a small section:

"Today's Farm Advisory"

Example content should be clearly marked as demo data.

Alerts

Show important notifications such as:

Weather alert

Crop health alert

Market update

Use realistic but clearly demo-generated content.

10. FARM PROFILE

Create /farm.

The farmer should be able to manage farm information.

Fields:

Farm name

State

District

Village

Farm location

Total land area

Land unit

Soil type

Irrigation type

Current crops

Allow multiple farms in the future.

Create the database structure so one farmer can own multiple farms.

11. CROP MANAGEMENT

Allow farmers to register crops.

Crop fields:

Crop name

Variety

Farm

Sowing date

Expected harvest date

Area

Growth stage

Initial supported crops:

Tomato

Potato

Architecture must allow more crops later.

12. DISEASE DETECTION PAGE

Create /disease-detection.

This is one of the most important features.

The final system will use YOLOv8 for crop disease detection.

For the current Part 1:

Create the complete UI but do NOT implement the actual YOLO model yet.

The initial supported disease scope is:

Tomato Late Blight

Potato Late Blight

The user should be able to:

Select crop

Upload/take a crop image

Preview the image

Submit for analysis

See analysis state

See result

Create states for:

Empty

Image selected

Uploading

Analyzing

Result

Error

Result layout should contain:

Crop

Detected disease

Confidence

Severity

Basic recommendation

Scan date

Image

For now use demo/mock result data.

Clearly structure the code so the future YOLOv8 FastAPI endpoint can replace the mock function.

Do NOT claim that the current application actually detects disease.

13. MARKET PAGE

Create /market.

The final system will eventually use market data and machine learning to forecast prices 2-4 weeks into the future.

For Part 1 create the professional interface only.

Include:

Crop selector

State selector

District/market selector

Current price

Minimum price

Maximum price

Historical price chart

Price trend

Forecast section

Recommended selling period

Market comparison

Use mock data.

Clearly label future prediction data as "Demo Forecast" until the real ML model is connected.

Create service abstraction for future market API integration.

Do not hard-code the user's API key.

14. WEATHER PAGE

Create /weather.

The final system will eventually use location and weather API data.

For Part 1 use mock data.

Display:

Current location

Temperature

Weather condition

Humidity

Wind speed

Rain probability

5-7 day forecast

Agricultural advisory

Weather alerts

Include crop-specific advisory UI.

Example:

"Heavy rainfall expected. Consider checking drainage around tomato crops."

Clearly label demo data until a real weather API is connected.

Create a weather service abstraction.

15. EQUIPMENT MARKETPLACE

Create /equipment.

The final system will support peer-to-peer agricultural equipment rental.

Initial equipment categories:

Tractor

Harvester

Drone

Cultivator

Sprayer

Other

Marketplace interface should include:

Search

Category filter

Location

Distance

Availability

Hourly price

Equipment card

Owner information

Rating

View details

Book equipment

Create:

/equipment
/equipment/:id
/equipment/list
/equipment/bookings

Do not implement real Razorpay payments yet.

Create the architecture for future:

GPS/location

Booking

Payment

UPI/Razorpay

Rating

Use demo marketplace data.

16. LOAN ADVISOR

Create /loan-advisor.

The final project will eventually integrate with government/financial systems.

Do NOT implement DigiLocker integration now.

Create a farmer-friendly questionnaire UI with:

Land area

Crop type

Annual farming income

Existing loans

Farming experience

Irrigation availability

Soil information

Crop history

Create a demo eligibility result screen.

Clearly label it:

"Demo Eligibility Assessment"

Do not present the demo score as an actual bank-approved eligibility result.

Create architecture for future integration with:

DigiLocker

Land records

Soil Health Card

Government schemes

Bank/CSC locator

17. ADVISORY PAGE

Create /advisory.

Include:

Crop advisory

Weather advisory

Disease prevention

Irrigation tips

Sowing guidance

Harvest guidance

Market guidance

Allow filtering by crop.

Use clean readable content cards.

This page should feel like an agricultural information service, not an AI chatbot.

18. LANGUAGE SYSTEM

Create a language selector in the application.

Initial languages:

English

Kannada

Do NOT implement Bhashini yet.

Create an internationalization structure so additional languages can later be added without rewriting components.

Do not hard-code user-facing text directly everywhere.

Use translation keys where practical.

Default language:

English.

Allow the farmer to switch to Kannada.

19. SETTINGS

Create /settings.

Sections:

Profile

Language

Location

Notifications

Privacy

Account

Help

Include notification preferences for:

Weather alerts

Disease alerts

Market alerts

Advisory alerts

20. ADMIN FOUNDATION

Create a professional admin dashboard.

Admin overview should show:

Total farmers

Active users

Disease scans

Registered farms

Equipment listings

Equipment bookings

Market searches

Weather/advisory usage

Create basic charts using demo data.

Admin pages:

Users

Disease Analytics

Equipment

Market Analytics

Reports

For disease analytics create a placeholder for the future:

"Crop Disease Outbreak Heatmap"

Do not build a fake real outbreak map.

Clearly label demo analytics as demo data.

21. DATABASE FOUNDATION

Use Supabase/PostgreSQL.

Create a clean schema foundation for:

users/profiles
farms
crops
disease_scans
market_data
equipment
equipment_bookings
weather_data
advisories
notifications

Use appropriate relationships.

Important:

One farmer can have multiple farms.

One farm can have multiple crops.

One farmer can have multiple disease scans.

One farmer can have multiple equipment bookings.

Use timestamps.

Use created_at and updated_at where appropriate.

Use foreign keys.

Design the schema so Row Level Security can later ensure farmers only access their own private records.

Do not store sensitive authentication credentials in ordinary database tables.

22. COMPONENT ARCHITECTURE

Create reusable components.

Examples:

AppHeader

Sidebar

MobileNavigation

PageHeader

FarmerProfileCard

WeatherCard

CropCard

DiseaseScanCard

MarketPriceCard

EquipmentCard

AdvisoryCard

AlertCard

EmptyState

LoadingState

ErrorState

LanguageSelector

LocationSelector

ConfirmationDialog

Avoid duplicating UI code.

23. RESPONSIVE DESIGN

The application must be mobile-first.

It must work properly on:

Desktop

Laptop

Tablet

Android phone browsers

The layout should adapt naturally.

Do not simply shrink the desktop UI.

Navigation should become mobile-friendly.

Buttons must be large enough for touch interaction.

Text must remain readable.

24. ACCESSIBILITY

Farmers may have low digital literacy.

Therefore:

Use simple language

Use clear icons with text

Use large touch targets

Maintain strong contrast

Avoid unnecessary technical terms

Avoid relying on color alone

Provide clear empty/error states

Use descriptive labels

Keep important actions obvious

For example:

Instead of:

"Run inference"

Use:

"Check Crop"

Instead of:

"Forecast"

Use:

"Expected Price"

Instead of:

"Geo-location"

Use:

"Farm Location"

25. ERROR AND LOADING STATES

Every major data-driven component must have:

Loading state

Empty state

Error state

Success state

Do not allow blank screens when data is unavailable.

For example:

Weather unavailable:

"Weather information is temporarily unavailable. Please try again later."

Disease detection failure:

"We couldn't analyze this image. Please upload a clearer crop photo."

26. DEMO DATA RULE

Since actual APIs and ML models will be connected in later parts:

Use realistic demo data where necessary.

But NEVER present mock data as real-time government/API data.

Use labels such as:

"Demo Data"

"Sample Forecast"

"Example Result"

where appropriate.

Keep mock data in separate files/services so it can easily be replaced later.

27. SECURITY FOUNDATION

Do not expose:

API keys

Supabase service-role keys

Future government API credentials

Razorpay secrets

WhatsApp credentials

ML service credentials

Use environment variables.

Prepare the project for proper authentication and authorization.

Do not place secrets in frontend source code.

28. FUTURE BACKEND ARCHITECTURE

Do not implement the complete backend now, but structure the frontend so the eventual architecture can become:

Frontend:
React web application

Backend:
Python FastAPI

Database:
PostgreSQL/Supabase

AI:
YOLOv8 + Python

ML:
Scikit-learn/TensorFlow

Cache:
Redis later if actually required

External integrations:
Market API
Weather API
Bhashini
DigiLocker
Razorpay
WhatsApp Cloud API

The frontend should communicate through service/API layers rather than directly embedding business logic.

29. CODE QUALITY

Generate clean, readable and maintainable code.

Requirements:

TypeScript

Reusable components

Clear folder structure

No unnecessary dependencies

No duplicated logic

No giant components

Meaningful variable names

Meaningful function names

Proper error handling

Environment variables

Modular services

Responsive components

Do not create fake functionality just to make the application appear complete.

30. PROJECT STRUCTURE

Organize the project logically, for example:

src/
components/
pages/
layouts/
services/
hooks/
lib/
types/
data/
translations/
contexts/
utils/

Keep future API services separated.

Example:

services/
weatherService
marketService
diseaseService
equipmentService
advisoryService

Initially these may return demo data.

Later we will replace them with real backend calls.

31. BRANDING

Application name:

AgriPulse

Tagline:

"Smart Farming. Better Decisions."

Use a simple professional agricultural logo treatment.

Do not use a robot or generic AI brain as the primary logo.

The visual identity should communicate:

Farming

Trust

Technology

Simplicity

32. DO NOT IMPLEMENT YET

Do NOT attempt these in Part 1:

Real YOLOv8 inference

Disease model training

Real-time WhatsApp bot

Meta WhatsApp API

Real Bhashini integration

Real voice recognition

Real DigiLocker integration

Real Aadhaar authentication

Real Razorpay payment

Production UPI payment

Real market prediction model

Real weather API integration

Production deployment

Complex Redis infrastructure

Production AWS infrastructure

These will be implemented in later development phases.

33. FINAL PART 1 ACCEPTANCE CRITERIA

The Part 1 implementation is successful only if:

The application runs correctly.

The landing page is professional.

Login/register pages work at development level.

Farmer dashboard works.

Farmer profile works.

Farm management UI works.

Crop management UI works.

Disease detection UI works using demo data.

Market UI works using demo data.

Weather UI works using demo data.

Equipment marketplace UI works using demo data.

Loan advisor UI works using demo data.

Advisory page works.

English/Kannada language structure exists.

Admin dashboard foundation exists.

Supabase/PostgreSQL foundation is configured.

Database relationships are logically designed.

UI is responsive.

Components are reusable.

No secret/API key is exposed.

Future integrations can be added without rebuilding the frontend.

The application does NOT look like a generic AI SaaS template.

Most importantly:

Build a strong foundation rather than pretending the entire AgriPulse system is already implemented.

This is Part 1 of a larger engineering project. Preserve clean architecture for all future parts.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/99b770e1-6bbc-43a1-9ea6-7e424647153d).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
