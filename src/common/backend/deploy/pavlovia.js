const https = require('https');

const GITLAB_HOSTNAME = 'gitlab.pavlovia.org/api/v4';

const open_get_request = ({options}) => {
    return new Promise((resolve, reject) => {
        const getOptions = {
            method: 'GET',
            ...options,
        };
        const req = https.request(getOptions, (res) => {
            res.on('data', (d) => {
                resolve(d);
            });
        });

        req.on('error', (e) => {
            reject(e);
        });

        req.end();
    });
}

const open_post_request = ({options, body}) => {
    return new Promise((resolve, reject) => {
        const postOptions = {
            method: "POST",
            ...options,
        };

        const req = https.request(postOptions, (res) => {
            res.on('data', (d) => {
                resolve(d);
            });
        })

        req.on('error', (e) => {
            reject(e);
        });

        req.write(body);
        req.end();
    });
}

const __Decoder = new TextDecoder("utf-8");
const decode = (d) => __Decoder.decode(d);

function isBase64(str) {
    try {
        return btoa(atob(str)) == str;
    } catch (err) {
        return false;
    }
}

export default class PavloviaConnector {
    // returns gitlab api response
    // user_id is data.id
    static async get_userId({username, access_token}) {
        const options = {
            hostname: GITLAB_HOSTNAME,
            path: `/users?username=${username}`,
            headers: {
                'Private-Token': access_token
            }
        }
        try {
            const response = await open_get_request({options});
            const data = JSON.parse(decode(response));
            return data;
        } catch (e) {
            return Promise.reject(e);
        }
    }

    // returns gitlab api response
    // project_id is data.id
    static async create_project({username, access_token, project_info}) {
        const options = {
            hostname: GITLAB_HOSTNAME,
            path: '/projects',
            headers: {
                'Private-Token': access_token,
                'Content-Type': 'application/json'
            }
        };
        const body = {
            visibility: 'public',
            name: 'jsPsych_Project',
            ...project_info,
        };
        try {
            const response = decode(await open_post_request({options, body}));
            const data = JSON.parse(response);
            return data;
        } catch (e) {
            return Promise.reject(e);
        }
    }

    // content_map: { file_path: file_content }
    static async deploy({project_id, access_token, content_map}) {
        const existing_files = new Set(await this.list_all_files({project_id, access_token}));
        const actions = [];
        for (let file_path of Object.keys(content_map)) {
            let action;
            if (existing_files.has(file_path)) {
                action = 'update';
            } else {
                action = 'create';
            }
            actions.push({
                action,
                file_path,
                content: content_map[file_path],
                encoding: isBase64(content_map[file_path]) ? 'base64' : 'text'
            });
        }

        const options = {
            hostname: GITLAB_HOSTNAME,
            path: `/projects/${project_id}/repository/commits`,
            headers: {
                'Private-Token': access_token,
                'Content-Type': 'application/json'
            }
        };
        const body = JSON.stringify({
            branch: 'master',
            commit_message: 'deployment updates from builder.jspsych.org',
            actions,
        });
        try {
            const response = await open_post_request({options, body});
            const data = JSON.parse(decode(response));
            return data;
        } catch (e) {
            return Promise.reject(e);
        }
    }

    static async list_all_files({project_id, access_token}) {
        const options = {
            hostname: GITLAB_HOSTNAME,
            path: `/projects/${project_id}/repository/tree?recursive=true&per_page=50`,
            headers: {
                'Private-Token': access_token
            }
        }
        const get_headers = () => {
            return new Promise((resolve, reject) => {
                const getOptions = {
                    method: 'GET',
                    ...options,
                };
                const req = https.request(getOptions, (res) => {
                    resolve(res.headers);
                });

                req.on('error', (e) => {
                    reject(e);
                });

                req.end();
            });
        };
        const list_files_at_page = async ({page}) => {
            const options = {
                hostname: GITLAB_HOSTNAME,
                path: `/projects/${project_id}/repository/tree?recursive=true&per_page=50&page=${page}`,
                headers: {
                    'Private-Token': access_token
                }
            }
            try {
                const response = await open_get_request({options});
                const data = JSON.parse(decode(response));
                return data.filter(o => o.type !== 'tree').map(o => o.path);;
            } catch (e) {
                return Promise.reject(e);
            }
        }

        try {
            const headers = await get_headers();
            const total = headers['x-total-pages'];
            if (total == undefined) throw 'Request failed.';
            const fetches = [];
            for (let p = 1; p <= total; p++) fetches.push(list_files_at_page({page: p}));
            const data = await Promise.all(fetches);
            return data[0];
        } catch (e) {
            return Promise.reject(e);
        }
    }
}