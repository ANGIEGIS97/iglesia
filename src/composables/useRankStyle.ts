import { computed, type Ref } from "vue";
import { getRankStyle, type RankStyle } from "../data/rankStyles";

export function useRankStyle(rank: Ref<number>) {
  return computed<RankStyle>(() => getRankStyle(rank.value));
}
