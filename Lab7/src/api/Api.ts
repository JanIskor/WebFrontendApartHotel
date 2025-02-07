/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface Application {
  /** ID */
  id?: number;
  /** Owner */
  owner?: string;
  /** Moderator */
  moderator?: string;
  /** Apartments */
  apartments?: string;
  /** Статус */
  status?: 1 | 2 | 3 | 4 | 5;
  /**
   * Дата создания
   * @format date-time
   */
  date_created?: string | null;
  /**
   * Дата формирования
   * @format date-time
   */
  date_formation?: string | null;
  /**
   * Дата завершения
   * @format date-time
   */
  date_complete?: string | null;
  /** Field */
  field?: string | null;
  /**
   * Total_price
   * @min -2147483648
   * @max 2147483647
   */
  total_price?: number | null;
}

export interface ApartmentApplication {
  /** ID */
  id?: number;
  /**
   * Wishes
   * @min -2147483648
   * @max 2147483647
   */
  wishes?: number;
  /** Apartment */
  apartment?: number | null;
  /** Application */
  application?: number | null;
}

export interface UpdateApplicationStatusAdmin {
  /** Status */
  status: number;
}

export interface ApartmentAdd {
  /**
   * Название
   * @minLength 1
   * @maxLength 100
   */
  name: string;
  /**
   * Описание
   * @minLength 1
   * @maxLength 500
   */
  description: string;
  /**
   * Цена
   * @min -2147483648
   * @max 2147483647
   */
  price: number;
  /**
   * Фото
   * @format uri
   */
  image?: string | null;
}

export interface Apartment {
  /** ID */
  id?: number;
  /** Image */
  image?: string;
  /**
   * Название
   * @minLength 1
   * @maxLength 100
   */
  name: string;
  /**
   * Описание
   * @minLength 1
   * @maxLength 500
   */
  description: string;
  /** Статус */
  status?: 1 | 2;
  /**
   * Цена
   * @min -2147483648
   * @max 2147483647
   */
  price: number;
}

export interface UserLogin {
  /**
   * Username
   * @minLength 1
   */
  username: string;
  /**
   * Password
   * @minLength 1
   */
  password: string;
}

export interface UserRegister {
  /** ID */
  id?: number;
  /**
   * Адрес электронной почты
   * @format email
   * @maxLength 254
   */
  email?: string;
  /**
   * Пароль
   * @minLength 1
   * @maxLength 128
   */
  password: string;
  /**
   * Имя пользователя
   * Обязательное поле. Не более 150 символов. Только буквы, цифры и символы @/./+/-/_.
   * @minLength 1
   * @maxLength 150
   * @pattern ^[\w.@+-]+$
   */
  username: string;
}

export interface UserProfile {
  /**
   * Username
   * @minLength 1
   */
  username?: string;
  /**
   * Email
   * @minLength 1
   */
  email?: string;
  /**
   * Password
   * @minLength 1
   */
  password?: string;
}

import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, HeadersDefaults, ResponseType } from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig<SecurityDataType = unknown> extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({ securityWorker, secure, format, ...axiosConfig }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({ ...axiosConfig, baseURL: axiosConfig.baseURL || "http://localhost:8000/api" });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(params1: AxiosRequestConfig, params2?: AxiosRequestConfig): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method && this.instance.defaults.headers[method.toLowerCase() as keyof HeadersDefaults]) || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] = property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(key, isFileType ? formItem : this.stringifyFormItem(formItem));
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (type === ContentType.FormData && body && body !== null && typeof body === "object") {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (type === ContentType.Text && body && body !== null && typeof body !== "string") {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title Snippets API
 * @version v1
 * @license BSD License
 * @termsOfService https://www.google.com/policies/terms/
 * @baseUrl http://localhost:8000/api
 * @contact <contact@snippets.local>
 *
 * Test description
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  applications = {
    /**
     * No description
     *
     * @tags applications
     * @name ApplicationsList
     * @request GET:/applications/
     * @secure
     */
    applicationsList: (
      query?: {
        status?: number;
        date_formation_start?: string;
        date_formation_end?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/applications/`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags applications
     * @name ApplicationsRead
     * @request GET:/applications/{application_id}/
     * @secure
     */
    applicationsRead: (applicationId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/applications/${applicationId}/`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags applications
     * @name ApplicationsDeleteDelete
     * @request DELETE:/applications/{application_id}/delete/
     * @secure
     */
    applicationsDeleteDelete: (applicationId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/applications/${applicationId}/delete/`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags applications
     * @name ApplicationsDeleteApartmentDelete
     * @request DELETE:/applications/{application_id}/delete_apartment/{apartment_id}/
     * @secure
     */
    applicationsDeleteApartmentDelete: (applicationId: string, apartmentId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/applications/${applicationId}/delete_apartment/${apartmentId}/`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags applications
     * @name ApplicationsUpdateUpdate
     * @request PUT:/applications/{application_id}/update/
     * @secure
     */
    applicationsUpdateUpdate: (applicationId: string, data: Application, params: RequestParams = {}) =>
      this.request<Application, any>({
        path: `/applications/${applicationId}/update/`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags applications
     * @name ApplicationsUpdateApartmentUpdate
     * @request PUT:/applications/{application_id}/update_apartment/{apartment_id}/
     * @secure
     */
    applicationsUpdateApartmentUpdate: (
      applicationId: string,
      apartmentId: string,
      data: ApartmentApplication,
      params: RequestParams = {},
    ) =>
      this.request<ApartmentApplication, any>({
        path: `/applications/${applicationId}/update_apartment/${apartmentId}/`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags applications
     * @name ApplicationsUpdateStatusAdminUpdate
     * @request PUT:/applications/{application_id}/update_status_admin/
     * @secure
     */
    applicationsUpdateStatusAdminUpdate: (
      applicationId: string,
      data: UpdateApplicationStatusAdmin,
      params: RequestParams = {},
    ) =>
      this.request<UpdateApplicationStatusAdmin, any>({
        path: `/applications/${applicationId}/update_status_admin/`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags applications
     * @name ApplicationsUpdateStatusUserUpdate
     * @request PUT:/applications/{application_id}/update_status_user/
     * @secure
     */
    applicationsUpdateStatusUserUpdate: (applicationId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/applications/${applicationId}/update_status_user/`,
        method: "PUT",
        secure: true,
        ...params,
      }),
  };
  apartments = {
    /**
     * No description
     *
     * @tags apartments
     * @name ApartmentsList
     * @request GET:/apartments/
     * @secure
     */
    apartmentsList: (
      query?: {
        apartment_name?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/apartments/`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags apartments
     * @name ApartmentsCreateCreate
     * @request POST:/apartments/create/
     * @secure
     */
    apartmentsCreateCreate: (
      data: {
        /**
         * @minLength 1
         * @maxLength 100
         */
        name: string;
        /**
         * @minLength 1
         * @maxLength 500
         */
        description: string;
        /**
         * @min -2147483648
         * @max 2147483647
         */
        price: number;
        /** @format binary */
        image?: File | null;
      },
      params: RequestParams = {},
    ) =>
      this.request<ApartmentAdd, any>({
        path: `/apartments/create/`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags apartments
     * @name ApartmentsRead
     * @request GET:/apartments/{apartment_id}/
     * @secure
     */
    apartmentsRead: (apartmentId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/apartments/${apartmentId}/`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags apartments
     * @name ApartmentsAddToApplicationCreate
     * @request POST:/apartments/{apartment_id}/add_to_application/
     * @secure
     */
    apartmentsAddToApplicationCreate: (apartmentId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/apartments/${apartmentId}/add_to_application/`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags apartments
     * @name ApartmentsDeleteDelete
     * @request DELETE:/apartments/{apartment_id}/delete/
     * @secure
     */
    apartmentsDeleteDelete: (apartmentId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/apartments/${apartmentId}/delete/`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags apartments
     * @name ApartmentsUpdateUpdate
     * @request PUT:/apartments/{apartment_id}/update/
     * @secure
     */
    apartmentsUpdateUpdate: (apartmentId: string, data: Apartment, params: RequestParams = {}) =>
      this.request<Apartment, any>({
        path: `/apartments/${apartmentId}/update/`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags apartments
     * @name ApartmentsUpdateImageCreate
     * @request POST:/apartments/{apartment_id}/update_image/
     * @secure
     */
    apartmentsUpdateImageCreate: (
      apartmentId: string,
      data: {
        /** @format binary */
        image?: File;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/apartments/${apartmentId}/update_image/`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.FormData,
        ...params,
      }),
  };
  users = {
    /**
     * No description
     *
     * @tags users
     * @name UsersLoginCreate
     * @request POST:/users/login/
     * @secure
     */
    usersLoginCreate: (data: UserLogin, params: RequestParams = {}) =>
      this.request<UserLogin, any>({
        path: `/users/login/`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags users
     * @name UsersLogoutCreate
     * @request POST:/users/logout/
     * @secure
     */
    usersLogoutCreate: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/users/logout/`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags users
     * @name UsersRegisterCreate
     * @request POST:/users/register/
     * @secure
     */
    usersRegisterCreate: (data: UserRegister, params: RequestParams = {}) =>
      this.request<UserRegister, any>({
        path: `/users/register/`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags users
     * @name UsersUpdateUpdate
     * @request PUT:/users/{user_id}/update/
     * @secure
     */
    usersUpdateUpdate: (userId: string, data: UserProfile, params: RequestParams = {}) =>
      this.request<UserProfile, any>({
        path: `/users/${userId}/update/`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
}
