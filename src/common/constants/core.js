export const getDefaultInitCloudDeployInfo = () => ({
	osfNode: null,
	osfAccess: null, // check userState.osfAccess[i]
	saveAfter: 0
})

export const getDefaultInitDiyDeployInfo = () => ({
	mode: enums.DIY_Deploy_Mode.disk,
	saveAfter: 0,
})