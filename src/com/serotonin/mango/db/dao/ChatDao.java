package com.serotonin.mango.db.dao;

import java.util.List;

import com.serotonin.mango.vo.UserComment;

public class ChatDao extends BaseDao {

	private static final String LAST_CHAT_SELECT = UserCommentRowMapper.USER_COMMENT_SELECT + 
		" where uc.commentType=" + UserComment.TYPE_CHAT + " order by uc.ts desc";
	private static final String LATEST_CHAT_SELECT = UserCommentRowMapper.USER_COMMENT_SELECT +
		"where uc.commentType=" + UserComment.TYPE_CHAT + " and uc.ts>? order by uc.ts desc";
	private static final String CHAT_RANGE_SELECT = UserCommentRowMapper.USER_COMMENT_SELECT + 
		"where uc.commentType=" + UserComment.TYPE_CHAT + " and uc.ts>? and uc.ts<? order by uc.ts asc";
	
	public List<UserComment> getLastChat() {
		List<UserComment> ucs = query(LAST_CHAT_SELECT, new Object[] {}, new UserCommentRowMapper(), 1);
		return ucs;
	}
	
	public List<UserComment> getLatestChats(long since) {
		return query(LATEST_CHAT_SELECT, new Object[] {since}, new UserCommentRowMapper());
	}
	
	public List<UserComment> getLatestChats(long since, int limit) {
		return query(LATEST_CHAT_SELECT, new Object[] {since}, new UserCommentRowMapper(), limit);
	}
	
	public List<UserComment> getChatRange(long startTime, long endTime) {
		return query(CHAT_RANGE_SELECT, new Object[] {startTime, endTime }, new UserCommentRowMapper());
	}
}