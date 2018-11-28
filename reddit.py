import mysql.connector
import re
import praw

mydb = mysql.connector.connect(
    auth_plugin='mysql_native_password',
    host=' 	h2cwrn74535xdazj.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
    database='gvw7pe966nc47xrf',
    user='r3fk7motovq38x7d',
    password='r07kl17y3p4snxcg'
)

myre = re.compile(u'('
                  u'\ud83c[\udf00-\udfff]|'
                  u'\ud83d[\udc00-\ude4f]|'
                  u'\uD83D[\uDE80-\uDEFF]|'
                  u"(\ud83d[\ude00-\ude4f])|"  # emoticon
                  u'[\u2600-\u2B55]|'
                  u'[\u23cf]|'
                  u'[\u1f918]|'
                  u'[\u23e9]|'
                  u'[\u231a]|'
                  u'[\u3030]|'
                  u'[\ufe0f]|'
                  u'\uD83D[\uDE00-\uDE4F]|'
                  u'\uD83C[\uDDE0-\uDDFF]|'
                  u'[\u2702-\u27B0]|'
                  u'\uD83D[\uDC00-\uDDFF])+',
                  re.UNICODE)

reddit = praw.Reddit(client_id='RkWGlCIjkTPhUQ',
                     client_secret='uMcdfncu3Cgws--K_65J5KDgiT0',
                     user_agent='my user agent')


# /r/music scrape
# ---------------------------------------------------------

rMusic = []

for submission in reddit.subreddit('music').top('week'):
    if submission.link_flair_text == 'music streaming':
        rMusic.append(myre.sub(' ', submission.title))

mycursor = mydb.cursor()
query = "INSERT INTO rMusicData (reddit_post) VALUES (%s)"
mycursor.executemany(query, [(r,) for r in rMusic])
mydb.commit()
print(mycursor.rowcount, "records inserted.")

# ---------------------------------------------------------

# /r/electronicmusic scrape NEEDS FILTERING NO POST FLAIR?
# ---------------------------------------------------------

rElectronicMusic = []

for submission in reddit.subreddit('electronicmusic').top('week'):
    # if submission.link_flair_text == 'music streaming':
    rElectronicMusic.append(myre.sub(' ', submission.title))

mycursor = mydb.cursor()
query = "INSERT INTO rElectronicMusicData (reddit_post) VALUES (%s)"
mycursor.executemany(query, [(r,) for r in rElectronicMusic])
mydb.commit()
print(mycursor.rowcount, "records inserted.")

# ---------------------------------------------------------

# /r/hiphopheads scrape NEEDS FILTERING NO POST FLAIR?
# ---------------------------------------------------------

rHipHopHeads = []

for submission in reddit.subreddit('hiphopheads').top('week'):
    # if submission.link_flair_text == 'music streaming':
    rHipHopHeads.append(myre.sub(' ', submission.title))

mycursor = mydb.cursor()
query = "INSERT INTO rHipHopHeadsData (reddit_post) VALUES (%s)"
mycursor.executemany(query, [(r,) for r in rHipHopHeads])
mydb.commit()
print(mycursor.rowcount, "records inserted.")

# ---------------------------------------------------------

# /r/rock scrape NEEDS FILTERING NO POST FLAIR?
# ---------------------------------------------------------

rRock = []

for submission in reddit.subreddit('rock').top('week'):
    # if submission.link_flair_text == 'music streaming':
    rRock.append(myre.sub(' ', submission.title))

mycursor = mydb.cursor()
query = "INSERT INTO rRockData (reddit_post) VALUES (%s)"
mycursor.executemany(query, [(r,) for r in rRock])
mydb.commit()
print(mycursor.rowcount, "records inserted.")

# ---------------------------------------------------------

# /r/metal scrape NEEDS FILTERING NO POST FLAIR?
# ---------------------------------------------------------

rMetal = []

for submission in reddit.subreddit('metal').top('week'):
    # if submission.link_flair_text == 'music streaming':
    rMetal.append(myre.sub(' ', submission.title))

mycursor = mydb.cursor()
query = "INSERT INTO rMetalData (reddit_post) VALUES (%s)"
mycursor.executemany(query, [(r,) for r in rMetal])
mydb.commit()
print(mycursor.rowcount, "records inserted.")

# ---------------------------------------------------------
