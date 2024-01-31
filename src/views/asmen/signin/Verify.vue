<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute  } from 'vue-router';
import VerifyService from '@/api/VerifyService';
import { URL_WEB, URL_WEB_Portal} from '@/api/env';

const router = useRouter();
const route = useRoute();
const time = ref(3000)

const idUser = ref(null);
const loadings = ref(true);

onMounted(() => {
    loadParams()
});

const loadParams = async () => {
    const token = route.query.token;
    // const id_user = route.params.id;
    console.log(token)
    if (token == null || token == '') {
        setTimeout(function() {
            window.close();
            loadings.value = false;
        }, time.value);
    } else {
        // if token expired
        const tokenData = parseJwt(token);
        const expirationTime = tokenData.exp * 1000;
        if (Date.now() > expirationTime) {
            setTimeout(function() {
                loadings.value = false;
                window.location.replace(`${URL_WEB_Portal}auth/login`);
                console.log('token expired')
            }, time.value);
        } else {
            const tokens = localStorage.getItem('usertoken');
            idUser.value = route.params.id;
            if (tokens == null) {
                const header = {
                    headers:{
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    }
                }
                try {
                    const verify = await VerifyService.getUser(idUser.value,header);
                    const load = verify.data;
                    const data = load.data;
                    if (data !== null) {
                        console.log(data);
                        const akses = await VerifyService.getAksesApp(15,header);
                        const load_akses = akses.data;
                        const data_akses = load_akses.data;
                        const filteredData = data_akses.filter(item => item.user_id === Number(idUser.value));
                        console.log(filteredData);
                        if (filteredData.length > 0) {
                            const pushdata = {
                                id :  idUser.value,
                                email : data.email,
                                name : data.name,
                                level: filteredData[0].level_akses,
                                divisi : data.divisi,
                                departemen : data.departemen,
                                department : data.department,
                                division : data.division,
                                grade : data.grade,
                            }
                            localStorage.setItem('roles', filteredData[0].level_akses);
                            localStorage.setItem('usertoken', token);
                            localStorage.setItem('payload', JSON.stringify(pushdata));
                            // console.log(filteredData[0].level_akses)
                            setTimeout(function() {
                                loadings.value = false;
                                if (filteredData[0].level_akses === 10) {
                                    window.location.replace(`${URL_WEB}home`);
                                } else {
                                    window.location.replace(`${URL_WEB}home`);
                                }
                            }, time.value);
                        } else {
                            window.location.replace(`${URL_WEB}error`);
                            // window.close();
                        }
                    } else {
                        window.close();
                    }
                } catch (error) {
                    console.log(error);
                    window.close();
                }
            } else {
                setTimeout(function() {
                    loadings.value = false;
                    const roles = localStorage.getItem('roles');
                    if (roles === 10) {
                        window.location.replace(`${URL_WEB}home`);
                    } else {
                        window.location.replace(`${URL_WEB}beranda`);
                    }
                }, time.value);
            }
        }
    }
}
const parseJwt = (token) => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

</script>

<template>
    <div class="flex align-items-center justify-content-center h-screen">
        <!-- <div class="surface-section px-4 py-8 md:px-6 lg:px-8">
            <div class="text-700 text-center">
                <div class="text-blue-600 font-bold mb-3"><i class="pi pi-user"></i>&nbsp;VERIFY ACCOUNT</div>
                <div class="text-900 font-bold text-5xl mb-3">Verifikasi Akun</div>
                <div class="text-700 text-2xl mb-5">Jika anda ingin masuk, silahkan klik <strong>Join Now</strong> untuk langkah selanjutnya.</div>
                <Button label="Join Now" icon="pi pi-discord" class="font-bold px-5 py-3 p-button-raised p-button-rounded white-space-nowrap"></Button>
            </div>
        </div> -->
        <div class="" v-show="loadings == true">
            <ProgressSpinner aria-label="Loading"/>
            <div class="text-gray-500 font-semibold">Please wait ...</div>
        </div>
    </div>
</template>