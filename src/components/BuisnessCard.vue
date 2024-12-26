<template>
    <div class="bg-white rounded-lg shadow-lg overflow-hidden">
        <div class="px-5 pt-5 flex flex-row">
            <div class="flex-col">
                <p class="text-lg text-gray-600">{{ businessDetail.name }}</p>
                <p class="text-xs text-gray-400">{{ businessDetail.symbol }}</p>
            </div>
            <div class="flex-grow" />
            <div class="flex-col text-right">
                <p class="text-lg text-gray-500">{{ price(businessDetail.business_info.market_cap) }}</p>
                <p class="text-xs text-gray-400">{{ capitalisation(businessDetail.business_info.market_cap) }}</p>
            </div>
        </div>
        <!-- tags -->
        <div class="px-4 pb-5 border-b">
            <div class="flex flex-col mt-3 overflow-hidden">
                <BusinessTag class="m-1">{{ businessDetail.business_info.sector }}</BusinessTag>
                <BusinessTag class="m-1">{{ businessDetail.business_info.industry }}</BusinessTag>
            </div>
        </div>
        <!-- infos -->
        <div class="flex px-5 py-1">
            <table class="min-w-full">
            <tbody class="divide-y">
                <tr>
                    <td class="whitespace-nowrap text-sm text-gray-500 py-2 flex items-center">    
                        <i class="fa-solid fa-money-bill-1 text-lg mr-2"></i>
                        chiffre d'affaire
                    </td>
                    <td class="text-right text-sm whitespace-nowrap text-gray-500 py-2">
                        {{price(businessDetail.business_ratio.revenue)}}
                    </td>
                </tr>
                <tr>
                    <td class="whitespace-nowrap text-sm text-gray-500 py-2 flex items-center">
                        <i class="fa-solid fa-coins text-lg mr-2"></i>
                        bénéfice ({{businessDetail.business_ratio.net_margin}}%)
                    </td>
                    <td class="text-right text-sm whitespace-nowrap text-gray-500 py-2">
                        {{price(businessDetail.business_ratio.earnings)}}
                    </td>
                </tr>
                <tr>
                    <td class="whitespace-nowrap text-sm text-gray-500 py-2 flex items-center">
                        <i class="fa-solid fa-piggy-bank text-lg mr-2"></i>
                        trésorerie ({{parseInt(businessDetail.business_ratio.years_of_cash * 12)}} mois)
                    </td>
                    <td class="text-right text-sm whitespace-nowrap text-gray-500 py-2">
                        {{price(businessDetail.business_ratio.cash_position)}}
                    </td>
                </tr>
                <tr>
                    <td class="whitespace-nowrap text-sm text-gray-500 py-2 flex items-center">
                        <i class="fa-solid fa-bomb text-lg mr-2"></i>
                        dette ({{parseInt(businessDetail.business_ratio.years_to_repay_debt * 12)}} mois)
                    </td>
                    <td
                        v-if="businessDetail.business_ratio.years_to_repay_debt" 
                        class="text-right text-sm whitespace-nowrap text-gray-500 py-2">
                        {{price(businessDetail.business_ratio.debt)}}
                    </td>
                </tr>
            </tbody>
            </table>
        </div>
        <!-- actions -->
        <div class="flex flex-row border-t divide-x rounded-b-lg">
            <button 
                v-if="!businessDetail.is_updated"
                class="flex flex-row justify-center space-x-2 text-sm text-gray-500 p-2 flex-grow"
                :class="{
                    'hover:bg-gray-100': this.status === null
                }"
                :disabled="this.status === 'syncing'"
                @click="syncBusiness()"
            >
                <LoadingSpinner v-if="status" size="xs" />
                <div>
                    mettre à jour
                </div>
            </button>
            <router-link class="text-center text-sm text-white p-2 flex-grow bg-primary hover:bg-secondary" :to="'/business/'+ businessDetail.pk + '/'">
                Voir détails
            </router-link>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import BusinessTag from '@/components/BusinessTag.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
export default {
    components: {
        BusinessTag,
        LoadingSpinner
    },
    props: {
        business: Object,
        button1: String,
        button1Callback: Function,
    },
    data() {
        return {
            status: null,
            businessDetail: this.business, // mutable
        }
    },
    methods: {
        capitalisation(price) {
            if (price < 300) {
                return 'nano cap'
            }
            if (price > 300 && price <= 2000) {
                return 'small cap'
            }
            if (price > 2000 && price < 10000) {
                return 'mid cap'
            }
            if (price > 10000 && price < 1000000) {
                return 'big cap'
            }
            if (price > 1000000) {
                return 'mega cap'
            }
        },
        price(price) {
            if (price < 1000) {
                return `${price}M`
            }
            price = parseInt(price / 100) / 10
            return `${price}G`
        },
        syncBusiness() {
            if (this.status === 'syncing') {
                return
            }
            this.status = 'syncing'
            axios
                .get(`https://04qeb8it0j.execute-api.eu-west-3.amazonaws.com/integration/sync_business/${this.business.pk}`)
                .then(data => {
                    this.status = null
                    this.businessDetail = data.data.business
                })
        }
    }
}
</script>