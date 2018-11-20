import praw
import csv
import re

reddit = praw.Reddit(client_id='RkWGlCIjkTPhUQ',
                     client_secret='uMcdfncu3Cgws--K_65J5KDgiT0',
                     user_agent='my user agent')

initialData = []
formattedData = ['artist,song_title']

for submission in reddit.subreddit('music').hot(limit=100):
    if submission.link_flair_text == 'music streaming':
        initialData.append(submission.title)

for val in initialData:
       newVal = val.replace(',', '').replace('--', '-').replace('-', ',')
       formattedData.append(re.sub("[\(\[].*?[\)\]]", "", newVal))

# print formattedData

# print '\n'.join(initialData)

with open("data.csv", "w") as f:
    wr = csv.writer(f, delimiter="\n")
    formattedData = [text.encode("utf8") for text in formattedData]
    wr.writerow(formattedData)

