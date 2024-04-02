/**
 * A Author structure
 * @typedef {Object} Author
 * @property {string} avatar - The avatar of user
 * @property {string} createdAt - The date of creating accout
 * @property {string} detaOfBirth - The date of birth current user
 * @property {string} email - The email of current user
 * @property {string} firstName - The first name of current user
 * @property {string} lastName - The last name of current user
 * @property {number} userId - The ID of current user
 * @property {string} updatedAt - The last date of updating
 */

/**
 * A Post structure
 * @typedef {Object} Post
 * @property {number} authorId - The ID of author
 * @property {string} createdAt - The date of creating post
 * @property {string} content - The text content of post
 * @property {number} postId - The ID of post
 * @property {string} updatedAt - The last date of updating
 * @property {File[]} attachments - The images of post
 */

/**
 * A PostInfo structure
 * @typedef {Object} PostInfo
 * @property {Author} author - The info about author of post
 * @property {Post[]} posts - The posts of current user
 */

/**
 * A UserInfo structure
 * @typedef {Object} UserInfo
 * @property {number} userId - The ID of user
 * @property {string} firstName - The first name of session's user
 * @property {string} lastName - The first name of session's user
 * @property {string} avatar - The file path of avatar of session's user
 */

/**
 * A ProfileInfo structure
 * @typedef {Object} ProfileInfo
 * @property {UserInfo} User - The info about profile's user
 * @property {boolean} isSubscribedTo - Is the session's user a subscriber of profile's user
 */