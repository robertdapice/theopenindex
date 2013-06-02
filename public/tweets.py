import twitter
from datetime import datetime
from dateutil import parser
api = twitter.Api()

depts = ['ABARES', 'DBCDEgov', 'DeptDefence', 'DEEWRspokesman', 'FaHCSIA', 'dfat', 'HealthAgeingau', 'HumanServicesAU', 'DIACAustralia', 'Aus_Industry', 'myregionGovAu', 'envirogov', 'DVAAus', 'Treasury_AU']

for dept in depts:
	statuses = api.GetUserTimeline(dept, count=200)
	deptTotalHours = 0
	deptReplies = 0
	lastStatusID = 0
	for tweet in statuses:
		lastStatusID = tweet.GetId()
		replyID = tweet.GetInReplyToStatusId()
		if replyID != None:
			try:
				replied = api.GetStatus(id=replyID)
				if replied != None:
					hours = (parser.parse(tweet.GetCreatedAt()) - parser.parse(replied.GetCreatedAt())).seconds / 3600
					deptReplies = deptReplies + 1
					deptTotalHours += hours
			except:
				pass
	print "dept: %s total: %d replies: %d lastID: %d" % (dept, deptTotalHours, deptReplies, lastStatusID)
	statuses = api.GetUserTimeline(dept, count=200, max_id=lastStatusID)
	deptTotalHours = 0
	deptReplies = 0
	lastStatusID = 0
	for tweet in statuses:
		lastStatusID = tweet.GetId()
		replyID = tweet.GetInReplyToStatusId()
		if replyID != None:
			try:
				replied = api.GetStatus(id=replyID)
				if replied != None:
					hours = (parser.parse(tweet.GetCreatedAt()) - parser.parse(replied.GetCreatedAt())).seconds / 3600
					deptReplies = deptReplies + 1
					deptTotalHours += hours
			except:
				pass
	print "dept: %s total: %d replies: %d lastID: %d" % (dept, deptTotalHours, deptReplies, lastStatusID)
	statuses = api.GetUserTimeline(dept, count=200, max_id=lastStatusID)
	deptTotalHours = 0
	deptReplies = 0
	lastStatusID = 0
	for tweet in statuses:
		lastStatusID = tweet.GetId()
		replyID = tweet.GetInReplyToStatusId()
		if replyID != None:
			try:
				replied = api.GetStatus(id=replyID)
				if replied != None:
					hours = (parser.parse(tweet.GetCreatedAt()) - parser.parse(replied.GetCreatedAt())).seconds / 3600
					deptReplies = deptReplies + 1
					deptTotalHours += hours
			except:
				pass
	print "dept: %s total: %d replies: %d lastID: %d" % (dept, deptTotalHours, deptReplies, lastStatusID)
	statuses = api.GetUserTimeline(dept, count=200, max_id=lastStatusID)
	deptTotalHours = 0
	deptReplies = 0
	lastStatusID = 0
	for tweet in statuses:
		lastStatusID = tweet.GetId()
		replyID = tweet.GetInReplyToStatusId()
		if replyID != None:
			try:
				replied = api.GetStatus(id=replyID)
				if replied != None:
					hours = (parser.parse(tweet.GetCreatedAt()) - parser.parse(replied.GetCreatedAt())).seconds / 3600
					deptReplies = deptReplies + 1
					deptTotalHours += hours
			except:
				pass
	print "dept: %s total: %d replies: %d lastID: %d" % (dept, deptTotalHours, deptReplies, lastStatusID)
	statuses = api.GetUserTimeline(dept, count=200, max_id=lastStatusID)
	deptTotalHours = 0
	deptReplies = 0
	lastStatusID = 0
	for tweet in statuses:
		lastStatusID = tweet.GetId()
		replyID = tweet.GetInReplyToStatusId()
		if replyID != None:
			try:
				replied = api.GetStatus(id=replyID)
				if replied != None:
					hours = (parser.parse(tweet.GetCreatedAt()) - parser.parse(replied.GetCreatedAt())).seconds / 3600
					deptReplies = deptReplies + 1
					deptTotalHours += hours
			except:
				pass
	print "dept: %s total: %d replies: %d lastID: %d" % (dept, deptTotalHours, deptReplies, lastStatusID)
				