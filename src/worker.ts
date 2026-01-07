const WORKER_URL = "https://sounds.dan-lee1.workers.dev/";

export function getSounds(){
    return fetch(WORKER_URL).then(res => res.json());
}