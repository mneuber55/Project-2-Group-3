import praw
import csv

reddit = praw.Reddit(client_id='RkWGlCIjkTPhUQ',
                     client_secret='uMcdfncu3Cgws--K_65J5KDgiT0',
                     user_agent='my user agent')

top100 = []

for submission in reddit.subreddit('music').hot(limit=100):
    top100.append(submission.title)
    
print '\n'.join(top100)

with open("data.csv", "w") as f:
    wr = csv.writer(f, delimiter="\n")
    top100 = [text.encode("utf8") for text in top100]
    wr.writerow(top100)

