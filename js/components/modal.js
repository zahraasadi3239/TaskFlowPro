// export function initTaskModal() {
//     console.log("Task modal initialized");

//     const modal = document.querySelector(".task-modal");
//     const closeButton = document.querySelector(".task-modal__close");
//     const cancelButton = document.querySelector(".task-modal__cancel");
//     const overlay = document.querySelector(".task-modal__overlay");

//     const titleInput = document.querySelector("#task-title");
//     const priorityInput = document.querySelector("#task-priority");

//     const modalTitle = document.querySelector(".task-modal__title");
//     const submitButton = document.querySelector(".task-modal__submit");

//     if (!modal) {
//         console.warn("Task modal was not found.");
//         return null;
//     }

//     /* ========================================
//        MODAL STATE
//     ======================================== */

//     let mode = "add";
//     let editingTaskId = null;

//     /* ========================================
//        OPEN MODAL
//     ======================================== */

//     function openModal() {
//         mode = "add";
//         editingTaskId = null;

//         modalTitle.textContent = "افزودن وظیفه";
//         submitButton.textContent = "افزودن وظیفه";

//         titleInput.value = "";
//         priorityInput.value = "medium";

//         modal.hidden = false;

//         titleInput.focus();
//     }

//     /* ========================================
//        OPEN EDIT MODAL
//     ======================================== */

//     function openEditModal(task) {
//         mode = "edit";
//         editingTaskId = task.id;

//         modalTitle.textContent = "ویرایش وظیفه";
//         submitButton.textContent = "ذخیره تغییرات";

//         titleInput.value = task.title;
//         priorityInput.value = task.priority.key;

//         modal.hidden = false;

//         titleInput.focus();
//     }

//     /* ========================================
//        CLOSE MODAL
//     ======================================== */

//     function closeModal() {
//         modal.hidden = true;

//         editingTaskId = null;
//     }

//     /* ========================================
//        EVENTS
//     ======================================== */

//     closeButton?.addEventListener("click", closeModal);

//     cancelButton?.addEventListener("click", closeModal);

//     overlay?.addEventListener("click", closeModal);

//     /* ========================================
//        RETURN
//     ======================================== */

//     return {
//         openModal,
//         openEditModal,
//         closeModal,

//         getMode() {
//             return mode;
//         },

//         getEditingTaskId() {
//             return editingTaskId;
//         },
//     };
// }

// export function initTaskModal() {
//   console.log("Modal initialized");

//   const modal = document.querySelector(".task-modal");
//   const closeButton = document.querySelector(".task-modal__close");
//   const cancelButton = document.querySelector(".task-modal__cancel");
//   const overlay = document.querySelector(".task-modal__overlay");

//   const modalTitle = document.querySelector(".task-modal__title");
//   const submitButton = document.querySelector(".task-modal__submit");
//   const form = document.querySelector(".task-modal__form");

//   if (!modal) {
//     console.warn("Modal was not found.");
//     return null;
//   }

//   /* ========================================
//        MODAL STATE
//     ======================================== */

//   let mode = "add";
//   let editingTaskId = null;

//   let currentType = "task";
//   let currentSubmitHandler = null;

//   /* ========================================
//        OPEN TASK ADD MODAL
//     ======================================== */

//   function openModal() {
//     currentType = "task";

//     mode = "add";
//     editingTaskId = null;

//     restoreTaskForm();

//     modalTitle.textContent = "افزودن وظیفه";
//     submitButton.textContent = "افزودن وظیفه";

//     const titleInput = document.querySelector("#task-title");
//     const priorityInput = document.querySelector("#task-priority");

//     if (titleInput) {
//       titleInput.value = "";
//     }

//     if (priorityInput) {
//       priorityInput.value = "medium";
//     }

//     modal.hidden = false;

//     titleInput?.focus();
//   }

//   /* ========================================
//        OPEN TASK EDIT MODAL
//     ======================================== */

//   function openEditModal(task) {
//     currentType = "task";

//     mode = "edit";
//     editingTaskId = task.id;

//     restoreTaskForm();

//     modalTitle.textContent = "ویرایش وظیفه";
//     submitButton.textContent = "ذخیره تغییرات";

//     const titleInput = document.querySelector("#task-title");
//     const priorityInput = document.querySelector("#task-priority");

//     if (titleInput) {
//       titleInput.value = task.title;
//     }

//     if (priorityInput) {
//       priorityInput.value = task.priority.key;
//     }

//     modal.hidden = false;

//     titleInput?.focus();
//   }

//   /* ========================================
//        OPEN ACTIVITY MODAL
//     ======================================== */

//   function openActivityModal({
//     mode: activityMode = "add",
//     activity = null,
//     onSubmit,
//   } = {}) {
//     currentType = "activity";

//     mode = activityMode;
//     editingTaskId = null;

//     currentSubmitHandler = onSubmit;

//     renderActivityForm(activityMode, activity);

//     modalTitle.textContent =
//       activityMode === "edit" ? "ویرایش فعالیت" : "افزودن فعالیت";

//     submitButton.textContent =
//       activityMode === "edit" ? "ذخیره تغییرات" : "افزودن فعالیت";

//     modal.hidden = false;

//     const targetInput = document.querySelector("#activity-target");

//     targetInput?.focus();
//   }

//   /* ========================================
//        ACTIVITY FORM
//     ======================================== */

//   function renderActivityForm(activityMode, activity = null) {
//     const existingFields = form.querySelectorAll(".task-modal__field");

//     existingFields.forEach((field) => {
//       field.remove();
//     });

//     const actions = form.querySelector(".task-modal__actions");

//     const fieldsWrapper = document.createDocumentFragment();

//     /* Target */

//     const targetField = document.createElement("div");

//     targetField.className = "task-modal__field";

//     targetField.innerHTML = `
//             <label for="activity-target">
//                 عنوان فعالیت
//             </label>

//             <input
//                 id="activity-target"
//                 class="task-modal__input"
//                 type="text"
//                 placeholder="مثلاً طراحی داشبورد"
//             >
//         `;

//     fieldsWrapper.appendChild(targetField);

//     /* Description */

//     const descriptionField = document.createElement("div");

//     descriptionField.className = "task-modal__field";

//     descriptionField.innerHTML = `
//             <label for="activity-description">
//                 توضیحات
//             </label>

//             <input
//                 id="activity-description"
//                 class="task-modal__input"
//                 type="text"
//                 placeholder="توضیحات فعالیت"
//             >
//         `;

//     fieldsWrapper.appendChild(descriptionField);

//     form.insertBefore(fieldsWrapper, actions);

//     if (activityMode === "edit" && activity) {
//       const targetInput = document.querySelector("#activity-target");

//       const descriptionInput = document.querySelector("#activity-description");

//       if (targetInput) {
//         targetInput.value = activity.target ?? "";
//       }

//       if (descriptionInput) {
//         descriptionInput.value = activity.description ?? "";
//       }
//     }
//   }

//   /* ========================================
//        RESTORE TASK FORM
//     ======================================== */

//   function restoreTaskForm() {
//     const existingFields = form.querySelectorAll(".task-modal__field");

//     existingFields.forEach((field) => {
//       field.remove();
//     });

//     const actions = form.querySelector(".task-modal__actions");

//     const fieldsWrapper = document.createDocumentFragment();

//     /* Task title */

//     const titleField = document.createElement("div");

//     titleField.className = "task-modal__field";

//     titleField.innerHTML = `
//             <label for="task-title">
//                 عنوان وظیفه
//             </label>

//             <input
//                 id="task-title"
//                 class="task-modal__input"
//                 type="text"
//                 placeholder="مثلاً طراحی صفحه اصلی"
//             >
//         `;

//     fieldsWrapper.appendChild(titleField);

//     /* Task priority */

//     const priorityField = document.createElement("div");

//     priorityField.className = "task-modal__field";

//     priorityField.innerHTML = `
//             <label for="task-priority">
//                 اولویت
//             </label>

//             <select
//                 id="task-priority"
//                 class="task-modal__input"
//             >
//                 <option value="high">زیاد</option>
//                 <option value="medium">متوسط</option>
//                 <option value="low">کم</option>
//             </select>
//         `;

//     fieldsWrapper.appendChild(priorityField);

//     form.insertBefore(fieldsWrapper, actions);
//   }

//   /* ========================================
//        SUBMIT
//     ======================================== */

//   form?.addEventListener("submit", (event) => {
//     event.preventDefault();

//     if (currentType !== "activity") {
//       return;
//     }

//     const targetInput = document.querySelector("#activity-target");

//     const descriptionInput = document.querySelector("#activity-description");

//     if (!targetInput) {
//       return;
//     }

//     const target = targetInput.value.trim();

//     const description = descriptionInput?.value.trim() ?? "";

//     if (!target) {
//       alert("عنوان فعالیت نمی‌تواند خالی باشد.");
//       targetInput.focus();
//       return;
//     }

//     if (typeof currentSubmitHandler === "function") {
//       currentSubmitHandler({
//         mode,
//         activity: {
//           target,
//           description,
//         },
//       });
//     }

//     closeModal();
//   });

//   /* ========================================
//        CLOSE MODAL
//     ======================================== */

//   function closeModal() {
//     modal.hidden = true;

//     editingTaskId = null;

//     currentSubmitHandler = null;

//     currentType = "task";

//     restoreTaskForm();
//   }

//   /* ========================================
//        EVENTS
//     ======================================== */

//   closeButton?.addEventListener("click", closeModal);

//   cancelButton?.addEventListener("click", closeModal);

//   overlay?.addEventListener("click", closeModal);

//   /* ========================================
//        RETURN API
//     ======================================== */

//   return {
//     /* Task */

//     openModal,

//     openEditModal,

//     /* Activity */

//     openActivityModal,

//     /* Common */

//     closeModal,

//     getMode() {
//       return mode;
//     },

//     getEditingTaskId() {
//       return editingTaskId;
//     },
//   };
// }
/* ========================================
   MODAL
======================================== */

// export function initTaskModal() {
//   console.log("Modal initialized");

//   const modal = document.querySelector(".task-modal");
//   const closeButton = document.querySelector(".task-modal__close");
//   const cancelButton = document.querySelector(".task-modal__cancel");
//   const overlay = document.querySelector(".task-modal__overlay");

//   const modalTitle = document.querySelector(".task-modal__title");
//   const submitButton = document.querySelector(".task-modal__submit");
//   const form = document.querySelector(".task-modal__form");

//   if (!modal) {
//     console.warn("Modal was not found.");
//     return null;
//   }

//   /* ========================================
//        MODAL STATE
//     ======================================== */

//   let mode = "add";
//   let editingTaskId = null;

//   let currentType = "task";
//   let currentSubmitHandler = null;

//   /* ========================================
//        TASK - ADD
//     ======================================== */

//   function openModal() {
//     currentType = "task";

//     mode = "add";
//     editingTaskId = null;

//     currentSubmitHandler = null;

//     restoreTaskForm();

//     modalTitle.textContent = "افزودن وظیفه";
//     submitButton.textContent = "افزودن وظیفه";

//     const titleInput = document.querySelector("#task-title");

//     const priorityInput = document.querySelector("#task-priority");

//     if (titleInput) {
//       titleInput.value = "";
//     }

//     if (priorityInput) {
//       priorityInput.value = "medium";
//     }

//     modal.hidden = false;

//     titleInput?.focus();
//   }

//   /* ========================================
//        TASK - EDIT
//     ======================================== */

//   function openEditModal(task) {
//     if (!task) {
//       return;
//     }

//     currentType = "task";

//     mode = "edit";
//     editingTaskId = task.id;

//     currentSubmitHandler = null;

//     restoreTaskForm();

//     modalTitle.textContent = "ویرایش وظیفه";
//     submitButton.textContent = "ذخیره تغییرات";

//     const titleInput = document.querySelector("#task-title");

//     const priorityInput = document.querySelector("#task-priority");

//     if (titleInput) {
//       titleInput.value = task.title ?? "";
//     }

//     if (priorityInput) {
//       priorityInput.value = task.priority?.key ?? "medium";
//     }

//     modal.hidden = false;

//     titleInput?.focus();
//   }

//   /* ========================================
//        ACTIVITY - ADD / EDIT
//     ======================================== */

//   function openActivityModal({
//     mode: activityMode = "add",
//     activity = null,
//     onSubmit = null,
//   } = {}) {
//     currentType = "activity";

//     mode = activityMode;

//     editingTaskId = null;

//     currentSubmitHandler = onSubmit;

//     renderActivityForm(activityMode, activity);

//     modalTitle.textContent =
//       activityMode === "edit" ? "ویرایش فعالیت" : "افزودن فعالیت";

//     submitButton.textContent =
//       activityMode === "edit" ? "ذخیره تغییرات" : "افزودن فعالیت";

//     modal.hidden = false;

//     const targetInput = document.querySelector("#activity-target");

//     targetInput?.focus();
//   }

//   /* ========================================
//        ACTIVITY FORM
//     ======================================== */

//   function renderActivityForm(activityMode, activity = null) {
//     clearFields();

//     const actions = form.querySelector(".task-modal__actions");

//     const fieldsWrapper = document.createDocumentFragment();

//     /* Target */

//     const targetField = document.createElement("div");

//     targetField.className = "task-modal__field";

//     targetField.innerHTML = `
//             <label for="activity-target">
//                 عنوان فعالیت
//             </label>

//             <input
//                 id="activity-target"
//                 class="task-modal__input"
//                 type="text"
//                 placeholder="مثلاً طراحی داشبورد"
//             >
//         `;

//     fieldsWrapper.appendChild(targetField);

//     /* Description */

//     const descriptionField = document.createElement("div");

//     descriptionField.className = "task-modal__field";

//     descriptionField.innerHTML = `
//             <label for="activity-description">
//                 توضیحات
//             </label>

//             <input
//                 id="activity-description"
//                 class="task-modal__input"
//                 type="text"
//                 placeholder="توضیحات فعالیت"
//             >
//         `;

//     fieldsWrapper.appendChild(descriptionField);

//     form.insertBefore(fieldsWrapper, actions);

//     /* EDIT VALUES */

//     if (activityMode === "edit" && activity) {
//       const targetInput = document.querySelector("#activity-target");

//       const descriptionInput = document.querySelector("#activity-description");

//       if (targetInput) {
//         targetInput.value = activity.target ?? "";
//       }

//       if (descriptionInput) {
//         descriptionInput.value = activity.description ?? "";
//       }
//     }
//   }

//   /* ========================================
//        RESTORE TASK FORM
//     ======================================== */

//   function restoreTaskForm() {
//     clearFields();

//     const actions = form.querySelector(".task-modal__actions");

//     const fieldsWrapper = document.createDocumentFragment();

//     /* TASK TITLE */

//     const titleField = document.createElement("div");

//     titleField.className = "task-modal__field";

//     titleField.innerHTML = `
//             <label for="task-title">
//                 عنوان وظیفه
//             </label>

//             <input
//                 id="task-title"
//                 class="task-modal__input"
//                 type="text"
//                 placeholder="مثلاً طراحی صفحه اصلی"
//             >
//         `;

//     fieldsWrapper.appendChild(titleField);

//     /* TASK PRIORITY */

//     const priorityField = document.createElement("div");

//     priorityField.className = "task-modal__field";

//     priorityField.innerHTML = `
//             <label for="task-priority">
//                 اولویت
//             </label>

//             <select
//                 id="task-priority"
//                 class="task-modal__input"
//             >
//                 <option value="high">
//                     زیاد
//                 </option>

//                 <option value="medium">
//                     متوسط
//                 </option>

//                 <option value="low">
//                     کم
//                 </option>
//             </select>
//         `;

//     fieldsWrapper.appendChild(priorityField);

//     form.insertBefore(fieldsWrapper, actions);
//   }

//   /* ========================================
//        CLEAR FORM FIELDS
//     ======================================== */

//   function clearFields() {
//     const fields = form.querySelectorAll(".task-modal__field");

//     fields.forEach((field) => {
//       field.remove();
//     });
//   }

//   /* ========================================
//        SUBMIT
//     ======================================== */

//   form?.addEventListener("submit", handleSubmit);

//   function handleSubmit(event) {
//     event.preventDefault();

//     /* ====================================
//            ACTIVITY SUBMIT
//         ==================================== */

//     if (currentType === "activity") {
//       const targetInput = document.querySelector("#activity-target");

//       const descriptionInput = document.querySelector("#activity-description");

//       if (!targetInput) {
//         return;
//       }

//       const target = targetInput.value.trim();

//       const description = descriptionInput?.value.trim() ?? "";

//       if (!target) {
//         alert("عنوان فعالیت نمی‌تواند خالی باشد.");

//         targetInput.focus();

//         return;
//       }

//       if (typeof currentSubmitHandler === "function") {
//         currentSubmitHandler({
//           mode,

//           activity: {
//             target,
//             description,
//           },
//         });
//       }

//       closeModal();

//       return;
//     }

//     /* ====================================
//            TASK SUBMIT
//         ==================================== */

//     const titleInput = document.querySelector("#task-title");

//     const priorityInput = document.querySelector("#task-priority");

//     if (!titleInput) {
//       return;
//     }

//     const title = titleInput.value.trim();

//     const priority = priorityInput?.value ?? "medium";

//     if (!title) {
//       alert("عنوان وظیفه نمی‌تواند خالی باشد.");

//       titleInput.focus();

//       return;
//     }

//     /*
//      * Task submission is intentionally
//      * handled by dashboard.js.
//      *
//      * The modal only exposes the current
//      * state through getMode() and
//      * getEditingTaskId().
//      */

//     const taskEvent = new CustomEvent("task-modal-submit", {
//       detail: {
//         mode,
//         taskId: editingTaskId,
//         title,
//         priority,
//       },
//     });

//     document.dispatchEvent(taskEvent);

//     closeModal();
//   }

//   /* ========================================
//        CLOSE MODAL
//     ======================================== */

//   function closeModal() {
//     modal.hidden = true;

//     editingTaskId = null;

//     currentSubmitHandler = null;

//     currentType = "task";

//     mode = "add";

//     restoreTaskForm();
//   }

//   /* ========================================
//        EVENTS
//     ======================================== */

//   closeButton?.addEventListener("click", closeModal);

//   cancelButton?.addEventListener("click", closeModal);

//   overlay?.addEventListener("click", closeModal);

//   /* ========================================
//        RETURN API
//     ======================================== */

//   return {
//     /* TASK */

//     openModal,

//     openEditModal,

//     /* ACTIVITY */

//     openActivityModal,

//     /* COMMON */

//     closeModal,

//     getMode() {
//       return mode;
//     },

//     getEditingTaskId() {
//       return editingTaskId;
//     },

//     getCurrentType() {
//       return currentType;
//     },
//   };
// }

/* ========================================
   MODAL
======================================== */

export function initTaskModal() {
  console.log("Modal initialized");

  const modal = document.querySelector(".task-modal");
  const closeButton = document.querySelector(".task-modal__close");
  const cancelButton = document.querySelector(".task-modal__cancel");
  const overlay = document.querySelector(".task-modal__overlay");

  const modalTitle = document.querySelector(".task-modal__title");
  const submitButton = document.querySelector(".task-modal__submit");
  const form = document.querySelector(".task-modal__form");

  if (!modal || !form) {
    console.warn("Task modal was not found.");
    return null;
  }

  /* ========================================
     STATE
  ======================================== */

  let modalType = "task";
  let mode = "add";
  let editingId = null;

  let currentSubmitHandler = null;
  let currentDeleteHandler = null;

  /* ========================================
     CLEAR FIELDS
  ======================================== */

  function clearFields() {
    const fields = form.querySelectorAll(".task-modal__field");

    fields.forEach((field) => {
      field.remove();
    });
  }

  /* ========================================
     RESTORE TASK FORM
  ======================================== */

  function restoreTaskForm() {
    clearFields();

    const actions = form.querySelector(".task-modal__actions");

    if (!actions) {
      return;
    }

    const fieldsWrapper = document.createDocumentFragment();

    /* Title */

    const titleField = document.createElement("div");

    titleField.className = "task-modal__field";

    titleField.innerHTML = `
      <label for="task-title">
        عنوان وظیفه
      </label>

      <input
        id="task-title"
        class="task-modal__input"
        type="text"
        placeholder="مثلاً طراحی صفحه اصلی"
      >
    `;

    fieldsWrapper.appendChild(titleField);

    /* Priority */

    const priorityField = document.createElement("div");

    priorityField.className = "task-modal__field";

    priorityField.innerHTML = `
      <label for="task-priority">
        اولویت
      </label>

      <select
        id="task-priority"
        class="task-modal__input"
      >
        <option value="high">زیاد</option>
        <option value="medium">متوسط</option>
        <option value="low">کم</option>
      </select>
    `;

    fieldsWrapper.appendChild(priorityField);

    form.insertBefore(fieldsWrapper, actions);
  }

  /* ========================================
     ACTIVITY FORM
  ======================================== */

  function renderActivityForm(activity = null) {
    clearFields();

    const actions = form.querySelector(".task-modal__actions");

    if (!actions) {
      return;
    }

    const fieldsWrapper = document.createDocumentFragment();

    /* Target */

    const targetField = document.createElement("div");

    targetField.className = "task-modal__field";

    targetField.innerHTML = `
      <label for="activity-target">
        عنوان فعالیت
      </label>

      <input
        id="activity-target"
        class="task-modal__input"
        type="text"
        placeholder="مثلاً طراحی داشبورد"
      >
    `;

    fieldsWrapper.appendChild(targetField);

    /* Description */

    const descriptionField = document.createElement("div");

    descriptionField.className = "task-modal__field";

    descriptionField.innerHTML = `
      <label for="activity-description">
        توضیحات
      </label>

      <input
        id="activity-description"
        class="task-modal__input"
        type="text"
        placeholder="مثلاً فعالیت ویرایش شد"
      >
    `;

    fieldsWrapper.appendChild(descriptionField);

    form.insertBefore(fieldsWrapper, actions);

    if (activity) {
      const targetInput = document.querySelector("#activity-target");
      const descriptionInput = document.querySelector("#activity-description");

      if (targetInput) {
        targetInput.value = activity.target ?? "";
      }

      if (descriptionInput) {
        descriptionInput.value = activity.description ?? "";
      }
    }
  }

  /* ========================================
     OPEN TASK ADD
  ======================================== */

  function openTaskAdd() {
    modalType = "task";
    mode = "add";
    editingId = null;

    currentSubmitHandler = null;
    currentDeleteHandler = null;

    restoreTaskForm();

    modalTitle.textContent = "افزودن وظیفه";
    submitButton.textContent = "افزودن وظیفه";

    const titleInput = document.querySelector("#task-title");
    const priorityInput = document.querySelector("#task-priority");

    if (titleInput) {
      titleInput.value = "";
    }

    if (priorityInput) {
      priorityInput.value = "medium";
    }

    modal.hidden = false;

    titleInput?.focus();
  }

  /* ========================================
     OPEN TASK EDIT
  ======================================== */

  function openTaskEdit(task) {
    if (!task) {
      return;
    }

    modalType = "task";
    mode = "edit";
    editingId = task.id;

    currentSubmitHandler = null;
    currentDeleteHandler = null;

    restoreTaskForm();

    modalTitle.textContent = "ویرایش وظیفه";
    submitButton.textContent = "ذخیره تغییرات";

    const titleInput = document.querySelector("#task-title");
    const priorityInput = document.querySelector("#task-priority");

    if (titleInput) {
      titleInput.value = task.title ?? "";
    }

    if (priorityInput) {
      priorityInput.value = task.priority?.key ?? "medium";
    }

    modal.hidden = false;

    titleInput?.focus();
  }

  /* ========================================
     OPEN ACTIVITY EDIT
  ======================================== */

  function openActivityEdit(activity, onSubmit) {
    if (!activity) {
      return;
    }

    modalType = "activity";
    mode = "edit";
    editingId = activity.id;

    currentSubmitHandler = onSubmit;
    currentDeleteHandler = null;

    renderActivityForm(activity);

    modalTitle.textContent = "ویرایش فعالیت";
    submitButton.textContent = "ذخیره تغییرات";

    modal.hidden = false;

    document.querySelector("#activity-target")?.focus();
  }

  /* ========================================
     OPEN DELETE CONFIRM
  ======================================== */

  function openDeleteConfirm({
    title = "حذف مورد",
    message = "آیا از حذف این مورد مطمئن هستید؟",
    onConfirm = null,
  } = {}) {
    modalType = "delete";
    mode = "delete";
    editingId = null;

    currentSubmitHandler = null;
    currentDeleteHandler = onConfirm;

    clearFields();

    modalTitle.textContent = title;
    submitButton.textContent = "حذف";

    const actions = form.querySelector(".task-modal__actions");

    if (!actions) {
      return;
    }

    const messageField = document.createElement("div");

    messageField.className = "task-modal__field";

    messageField.innerHTML = `
      <p class="task-modal__delete-message">
        ${message}
      </p>
    `;

    form.insertBefore(messageField, actions);

    modal.hidden = false;

    submitButton.focus();
  }

  /* ========================================
     SUBMIT
  ======================================== */

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    /* ====================================
       DELETE
    ==================================== */

    if (modalType === "delete") {
      if (typeof currentDeleteHandler === "function") {
        currentDeleteHandler();
      }

      closeModal();

      return;
    }

    /* ====================================
       ACTIVITY
    ==================================== */

    if (modalType === "activity") {
      const targetInput = document.querySelector("#activity-target");
      const descriptionInput = document.querySelector("#activity-description");

      if (!targetInput) {
        return;
      }

      const target = targetInput.value.trim();
      const description = descriptionInput?.value.trim() ?? "";

      if (!target) {
        alert("عنوان فعالیت نمی‌تواند خالی باشد.");

        targetInput.focus();

        return;
      }

      if (typeof currentSubmitHandler === "function") {
        currentSubmitHandler({
          id: editingId,
          mode,
          activity: {
            target,
            description,
          },
        });
      }

      closeModal();

      return;
    }

    /* ====================================
       TASK
    ==================================== */

    const titleInput = document.querySelector("#task-title");
    const priorityInput = document.querySelector("#task-priority");

    if (!titleInput) {
      return;
    }

    const title = titleInput.value.trim();
    const priority = priorityInput?.value ?? "medium";

    if (!title) {
      alert("عنوان وظیفه نمی‌تواند خالی باشد.");

      titleInput.focus();

      return;
    }

    document.dispatchEvent(
      new CustomEvent("task-modal-submit", {
        detail: {
          mode,
          taskId: editingId,
          title,
          priority,
        },
      }),
    );

    closeModal();
  });

  /* ========================================
     CLOSE
  ======================================== */

  function closeModal() {
    modal.hidden = true;

    modalType = "task";
    mode = "add";
    editingId = null;

    currentSubmitHandler = null;
    currentDeleteHandler = null;

    restoreTaskForm();
  }

  /* ========================================
     EVENTS
  ======================================== */

  closeButton?.addEventListener("click", closeModal);

  cancelButton?.addEventListener("click", closeModal);

  overlay?.addEventListener("click", closeModal);

  /* ========================================
     API
  ======================================== */

  return {
    openModal: openTaskAdd,

    openEditModal: openTaskEdit,

    openActivityModal: openActivityEdit,

    openDeleteConfirm,

    closeModal,

    getMode() {
      return mode;
    },

    getEditingId() {
      return editingId;
    },

    getType() {
      return modalType;
    },
  };
}
