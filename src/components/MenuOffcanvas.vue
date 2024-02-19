<template>
    <div class="offcanvas offcanvas-end" data-bs-backdrop="true" id="menuOffcanvas">

        <div class="offcanvas-body">
            <div class="d-flex flex-align-start flex-column h-100 w-100">

                <div class="h-100 w-100 d-flex align-items-end">
                    <div class="menulist list-group list-group-flush w-100">
                        <!-- <a href="#" class="list-group-item w-100" @click="openSettingModal">
                            <h2>設定</h2>
                        </a>
                        <a href="#" class="list-group-item w-100" @click="openSettingModal">
                            <h2>設定</h2>
                        </a> -->
                        <a href="#" class="list-group-item w-100" @click="openSettingModal">
                            <h2>設定</h2>
                        </a>
                    </div>
                </div>

                <div class="offcanvas-header w-100 m-0 p-0">
                    <h2 class="offcanvas-title">todo-timer</h2>
                    <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas"
                        aria-label="Close"></button>
                </div>

            </div>

        </div>
    </div>
</template>
<script>
import { Modal, Offcanvas } from 'bootstrap';
export default {
    methods: {
        openSettingModal() {
            const DrawerOffcanvas = document.getElementById('menuOffcanvas');
            const offcanvas = Offcanvas.getOrCreateInstance(DrawerOffcanvas);
            offcanvas.hide();
            const settingModal = document.getElementById('settingModal');
            const modal = Modal.getOrCreateInstance(settingModal);
            modal.show();
        },
    }
}

</script>
<style lang="scss">
$navcolor: #111111;
$navcolor2: #1a1a1a;

$navfg: orange;
#menuOffcanvas {
    background-color: $navfg;
    color: $navcolor;
}

.menulist {
  .list-group-item {
    color: $navcolor2;
    background-color: transparent;
    border-color: lightcoral;
  }

  .list-group-item:hover {
    color: $navcolor;
  }
}
</style>