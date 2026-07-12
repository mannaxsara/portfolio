---
title: "Predicting the Future (of Blast Furnaces) with Facebook Prophet"
date: "15/06/2026"
description: "What happens when you throw time-series forecasting at messy industrial plant data? Spoiler: a lot of data cleaning, some beautiful charts, and a few surprised engineers."
---

Before this internship, my mental image of a "data analyst" was someone sitting in a sleek office with a MacBook, sipping coffee while Tableau dashboards sparkled on a giant monitor. Then I actually showed up at the SAIL Bhilai Steel Plant — one of India's largest steel manufacturing facilities — and reality hit different.

## The Assignment

My task as a trainee data analyst was straightforward on paper: analyze operational sensor data from blast furnace components and build predictive models to forecast temperature fluctuations. In practice, this meant wrestling with industrial datasets that had more missing values than a mystery novel.

## The Data (Oh, the Data)

Industrial sensor data is... humbling. Sensors malfunction. Readings spike for no apparent reason. Entire days of data just vanish because someone rebooted a system. My preprocessing pipeline ended up being twice as long as my actual modeling code — and honestly, I think that's normal in this field.

Here's what the cleanup looked like:

- **Outlier detection**: Rolling window z-scores to catch impossible temperature readings (no, the furnace did not reach the temperature of the sun for exactly one millisecond)
- **Imputation**: Forward-fill for short gaps, rolling average interpolation for longer ones
- **Resampling**: Converting irregular timestamp intervals into clean hourly data points

I probably spent 70% of my time on data cleaning. Every data science course warns you about this, but you don't truly understand until you're staring at a CSV file with 47,000 rows and wondering why column 12 is sometimes a number and sometimes the word "ERROR."

## Why Prophet?

Facebook's Prophet framework was a natural fit for this problem because industrial operations have strong seasonal patterns — daily temperature cycles, weekly maintenance schedules, monthly production targets. Prophet handles these beautifully because it treats time-series forecasting as an additive regression problem:

**y(t) = trend + seasonality + holidays + noise**

Unlike ARIMA models (which require you to manually check for stationarity, difference the series, tune p/d/q parameters, and basically get a statistics PhD before you can use them), Prophet lets you specify the components declaratively and handles the heavy lifting under the hood.

## The Results

Our model predicted blast furnace temperature fluctuations with reasonable accuracy over 24-hour and 7-day horizons. The real win wasn't the MAPE score though — it was showing the plant engineers a dashboard where they could see "hey, based on current trends, this component is likely to overheat in the next 18 hours" and watching them actually use it to schedule preventive maintenance.

That moment when theoretical data science becomes a tool that prevents real equipment failures? That's the dopamine hit I'm chasing in this career.

## What I Learned

- **Data cleaning is the real skill.** Anyone can call `model.fit()`. The hard part is getting your data to a state where that call produces meaningful results.
- **Domain knowledge matters.** I spent my first week just learning how blast furnaces work, and it made every modeling decision 10x better.
- **Keep it simple.** The engineers didn't care about my fancy hyperparameter tuning — they cared about a clear forecast they could act on.

If I could go back and tell past-me one thing before starting this internship, it would be: "learn pandas better." Seriously. `pd.merge()` and `groupby()` will become your best friends 🐼📊
