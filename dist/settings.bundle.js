(()=>{var n;n=Handlebars.template,(Handlebars.templates=Handlebars.templates||{})["settingsMain.hbs"]=n({compiler:[8,">= 4.3.0"],main:function(n,t,s,i,a){var e=n.lambda,r=n.escapeExpression,c=n.lookupProperty||function(n,t){if(Object.prototype.hasOwnProperty.call(n,t))return n[t]};return'<div class="settings">\n  <div class="setting">\n    <div class="setting-info">\n      <span class="setting__span">Фамилия</span>\n      <input\n        type="text"\n        class="setting__input"\n        value="'+r(e(null!=t?c(t,"lastName"):t,t))+'"\n        id="last-name"\n      />\n    </div>\n    <div\n      class="form__input__error form__input__correct"\n      id="incorrect-last-name"\n    >\n      Некорректное имя\n    </div>\n  </div>\n  <div class="setting">\n    <div class="setting-info">\n      <span class="setting__span">Имя</span>\n      <input\n        type="text"\n        class="setting__input"\n        value="'+r(e(null!=t?c(t,"firstName"):t,t))+'"\n        id="first-name"\n      />\n    </div>\n    <div\n      class="form__input__error form__input__correct"\n      id="incorrect-first-name"\n    >\n      Некорректное имя\n    </div>\n  </div>\n  <div class="email-setting">\n    <div class="setting-info">\n      <span class="setting__span">Почта</span>\n      <input\n        type="text"\n        class="setting__input"\n        value="'+r(e(null!=t?c(t,"email"):t,t))+'"\n        id="email"\n      />\n    </div>\n    <div class="form__input__error form__input__correct" id="incorrect-email">\n      Некорректная почта\n    </div>\n    <div class="form__input__error form__input__correct" id="repeat-email">\n      Почта уже существует\n    </div>\n  </div>\n  <div class="setting">\n    <div class="setting-info">\n      <span class="setting__span">Изменить пароль</span>\n      <input\n        type="password"\n        class="setting__input"\n        placeholder="Пароль (не менее 6 символов)"\n        id="password"\n        value=""\n        autocomplete="off"\n      />\n    </div>\n    <div\n      class="form__input__error form__input__correct"\n      id="incorrect-password"\n    >\n      Пароль должен иметь длину не менее 6 символов\n    </div>\n  </div>\n  <div class="setting">\n    <div class="setting-info">\n      <span class="setting__span">Повторите пароль</span>\n      <input\n        type="password"\n        class="setting__input"\n        placeholder="Повторите пароль"\n        id="repeat-password"\n        value=""\n      />\n    </div>\n    <div\n      class="form__input__error form__input__correct"\n      id="incorrect-repeat-password"\n    >\n      Пароли должны совпадать\n    </div>\n  </div>\n  <div class="avatar-setting">\n    <span class="setting__span">Обновить фотографию</span>\n    <div class="file-input">\n      <label class="input-avatar-setting">\n        <input\n          class="input-avatar-setting__input"\n          type="file"\n          name="avatar"\n          id="avatar"\n          accept="image/png, image/gif, image/jpeg, image/jpg, image/webp"\n        />\n        <span class="input-avatar__span">Загрузить изображение </span>\n      </label>\n    </div>\n    <img\n      class="setting-avatar-prewatch"\n      id="prewatch"\n      src="'+r(e(null!=t?c(t,"staticUrl"):t,t))+"/"+r(e(null!=t?c(t,"avatar"):t,t))+'"\n    />\n    <div class="form__input__error form__input__correct" id="incorrect-avatar">\n      Недопустимый тип файла\n    </div>\n  </div>\n  <div class="accept-setting">\n    <button class="accept-setting__button" id="accept-setting">\n      Сохранить\n    </button>\n    <button class="cancel-setting__button" id="cancel-setting">\n      Отменить изменения\n    </button>\n  </div>\n</div>\n<button class="delete-setting__button" id="delete-setting">\n  Удалить аккаунт\n</button>\n'},useData:!0})})();