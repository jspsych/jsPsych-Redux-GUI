export const internetError = new Error("Your internet may be disconnected !");

export class NotVerifiedException extends Error {
	constructor(message='You must verify your account first.') {
		super(message);
		this.name = 'NotVerifiedException';
		this.message = message;
	}
}

export class NoCurrentUserException extends Error {
	constructor(message='There is no currently signed in user.') {
		super(message);
		this.name = 'NoCurrentUserException';
		this.code = 'NoCurrentUserException';
		this.message = message;
	}
}